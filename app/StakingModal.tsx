'use client'

import React, { useEffect, useMemo, useState } from 'react'
import MyMultiButton from '../components/MyMultiButton'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, StakeProgram, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL, Keypair, Lockup, clusterApiUrl, ParsedAccountData, AccountInfo } from '@solana/web3.js'
import { Spin } from 'antd'
import { toast } from 'sonner'

function StakingModal() {
  const wallet = useWallet()
  const [balances, setBalances] = useState({
    yourBalance: 0,
    staked: 0,
    activating: 0,
    deactivating: 0,
    withdrawable: 0
  });
  const [stakeAccount, setStakeAccount] = useState<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[]>([]);


  const [loadingStates, setLoadingStates] = useState({
    stakeAccount: false,
    stakeTx: false,
    unstakeTx: false,
  });
  const [isLoadingTx, setLoadingTx] = useState(false);
  const [reload, setReload] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const yearlyRewardRate = 0.0722; // 3% yearly reward

  const totalStakedAndActivating = useMemo(() => balances.staked + balances.activating + Number(inputValue), [balances, inputValue]);
  const dailyReward = useMemo(() => (totalStakedAndActivating * yearlyRewardRate) / 365, [totalStakedAndActivating, yearlyRewardRate]);
  const weeklyReward = useMemo(() => dailyReward * 7, [dailyReward]);
  const monthlyReward = useMemo(() => dailyReward * 30, [dailyReward]);

  useEffect(() => {
    const validatorPubKey = new PublicKey(process.env.NEXT_PUBLIC_VALIDATOR_PUBKEY!);
    const STAKE_PROGRAM_ID = new PublicKey(
      "Stake11111111111111111111111111111111111111"
    );

    async function getStakeAccount() {
      try {
        setLoadingStates(prev => ({ ...prev, stakeAccount: true }));

        const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL!, "processed");

        const epoch = await connection.getEpochInfo();

        const accounts = await connection.getParsedProgramAccounts(STAKE_PROGRAM_ID, {
          filters: [
            {
              dataSize: 200, // number of bytes
            },
            {
              memcmp: {
                offset: 44, // number of bytes
                bytes: wallet.publicKey!.toBase58(), // base58 encoded string
              },
            },
          ],
        });

        const filteredAccounts = accounts.filter((account) => (account.account.data as ParsedAccountData).parsed.info.stake.delegation.voter === validatorPubKey.toBase58());
        if (filteredAccounts.length) {
          setStakeAccount(filteredAccounts)

          let totalStaked = 0;
          let totalActivating = 0;
          let totalDeactivating = 0;
          let totalWithdrawable = 0;

          filteredAccounts.forEach(account => {
            const balance = account.account.lamports / LAMPORTS_PER_SOL;
            const stakeAccountData = account.account.data as ParsedAccountData;
            const activationEpoch = stakeAccountData.parsed.info.stake.delegation.activationEpoch;
            const deactivationEpoch = stakeAccountData.parsed.info.stake.delegation.deactivationEpoch;

            console.log(`Account: ${account.pubkey.toBase58()}, Activation Epoch: ${activationEpoch}, Current Epoch: ${epoch.epoch}, Deactivation Epoch: ${deactivationEpoch}`);

            // Adjusting the isActivating condition to include the case where the current epoch equals the activation epoch
            const isActivating = epoch.epoch <= activationEpoch && (deactivationEpoch === "18446744073709551615" || epoch.epoch < deactivationEpoch);
            const isDeactivating = epoch.epoch >= deactivationEpoch && deactivationEpoch !== "18446744073709551615";
            // Adjusting the isActive condition to exclude the case where the current epoch equals the activation epoch
            const isActive = epoch.epoch > activationEpoch && (deactivationEpoch === "18446744073709551615" || epoch.epoch < deactivationEpoch);
            const isWithdrawable = !isActivating && !isActive && !isDeactivating;

            if (isActivating) {
              console.log(`Activating: ${account.pubkey.toBase58()}`);
              totalActivating += balance;
            } else if (isDeactivating) {
              console.log(`Deactivating: ${account.pubkey.toBase58()}`);
              totalDeactivating += balance;
            } else if (isActive) {
              console.log(`Active: ${account.pubkey.toBase58()}`)
              totalStaked += balance;
            } else if (isWithdrawable) {
              console.log(`Withdrawable: ${account.pubkey.toBase58()}`)
              totalWithdrawable += balance;
            }
          });

          // Update the state with the calculated totals
          setBalances({
            yourBalance: balances.yourBalance, // Assuming this is fetched elsewhere
            staked: totalStaked,
            activating: totalActivating,
            deactivating: totalDeactivating,
            withdrawable: totalWithdrawable
          });
        }
        setLoadingStates(prev => ({ ...prev, stakeAccount: false }));
      } catch (error) {
        console.log(error, "error")
        setLoadingStates(prev => ({ ...prev, stakeAccount: false }));
      }
    }
    if (wallet.publicKey) {
      getStakeAccount();
    }
  }, [wallet.publicKey, reload])

  const handleStake = async () => {
    try {
      if (!wallet.publicKey) {
        throw new Error('Wallet public key is null');
      }

      if (Number(inputValue) <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (Number(inputValue) > balances.yourBalance) {
        throw new Error("You don't have enough SOL to stake")
      }

      setLoadingStates(prev => ({ ...prev, stakeTx: true }));

      const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL!)
      const validatorPubKey = new PublicKey(process.env.NEXT_PUBLIC_VALIDATOR_PUBKEY!)
      let transaction = new Transaction();
      let stakeAccountKey;
      let newStakeAccountKP;
      // Create a new stake account if it doesn't exist
      console.log('Creating a new stake account')
      const stakeAccount = Keypair.generate();
      stakeAccountKey = stakeAccount.publicKey;
      const createStakeAccountInstruction = StakeProgram.createAccount({
        fromPubkey: wallet.publicKey,
        stakePubkey: stakeAccountKey,
        authorized: {
          staker: wallet.publicKey,
          withdrawer: wallet.publicKey,
        },
        lamports: Number(inputValue) * LAMPORTS_PER_SOL,
        lockup: new Lockup(0, 0, wallet.publicKey), // Optional. We'll set this to 0 for demonstration purposes.
      });

      // Add the create account instruction to a transaction
      console.log('Adding instructions to transaction')
      newStakeAccountKP = stakeAccount;
      transaction.add(createStakeAccountInstruction);

      console.log('Delegating stake to validator')
      // Delegate stake to the validator
      console.log(stakeAccountKey)
      const delegateInstruction = StakeProgram.delegate({
        stakePubkey: stakeAccountKey!,
        authorizedPubkey: wallet.publicKey,
        votePubkey: validatorPubKey,
      });
      console.log('Adding instructions to transaction')
      // Add the delegate instruction to a transaction
      transaction.add(delegateInstruction);

      // Get recent blockhash
      const hash = await connection.getLatestBlockhash();

      transaction.recentBlockhash = hash.blockhash;
      transaction.feePayer = wallet.publicKey;
      if (newStakeAccountKP) {
        transaction.partialSign(newStakeAccountKP);
      }

      // Sign and send the transaction
      if (!wallet || !wallet.signTransaction) {
        throw new Error('Wallet is not connected or signTransaction function is not available');
      }
      console.log('Signing transaction..')
      const signedTransaction = await wallet.signTransaction(transaction);
      const transactionId = await connection.sendRawTransaction(signedTransaction.serialize());

      console.log('Transaction ID:', transactionId);

      await connection.confirmTransaction({
        signature: transactionId,
        blockhash: hash.blockhash,
        lastValidBlockHeight: hash.lastValidBlockHeight,
      }, "finalized");

      setReload((prev) => prev + 1);
      setLoadingStates(prev => ({ ...prev, stakeTx: false }));
      toast.success('Staked successfully')
    } catch (error) {
      console.log(error, "error");
      setLoadingStates(prev => ({ ...prev, stakeTx: false }));
      toast.error((error as Error).message);
    }
  }

  const handleDeactivateAll = async () => {
    try {
      if (!wallet.publicKey || !stakeAccount) {
        throw new Error('Wallet public key is null or stake account is not set');
      }

      if (!stakeAccount) {
        throw new Error('No Stakeaccount');
      }

      if (balances.staked + balances.activating <= 0) {
        throw new Error("You don't have any stake to deactivate")

      }

      setLoadingStates(prev => ({ ...prev, unstakeTx: true }));

      const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL!)

      const transaction = new Transaction();

      for (const account of stakeAccount) {
        // Deactivate the stake
        const deactivateInstruction = StakeProgram.deactivate({
          stakePubkey: account.pubkey,
          authorizedPubkey: wallet.publicKey,
        });

        transaction.add(deactivateInstruction);
      }

      // Get recent blockhash
      const hash = await connection.getLatestBlockhash();

      transaction.recentBlockhash = hash.blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign and send the transaction
      if (!wallet || !wallet.signTransaction) {
        throw new Error('Wallet is not connected or signTransaction function is not available');
      }
      const signedTransaction = await wallet.signTransaction(transaction);
      const transactionId = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log('Transaction ID:', transactionId);

      await connection.confirmTransaction({
        signature: transactionId,
        blockhash: hash.blockhash,
        lastValidBlockHeight: hash.lastValidBlockHeight,
      }, "finalized");

      setReload((prev) => prev + 1);
      setLoadingStates(prev => ({ ...prev, unstakeTx: false }));
      toast.success('Unstaked successfully')
    } catch (error) {
      console.log(error, "error");
      setLoadingStates(prev => ({ ...prev, unstakeTx: false }));
      toast.error((error as Error).message);
    }
  }

  const handleWithdraw = async () => {
    try {
      if (!wallet.publicKey || !stakeAccount) {
        throw new Error('Wallet public key is null or stake account is not set');
      }

      if (!stakeAccount) {
        throw new Error('No Stakeaccount');
      }

      if (Number(inputValue) <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (Number(inputValue) > balances.withdrawable) {
        throw new Error("You don't have enough SOL withdrawable")
      }

      setLoadingTx(true);

      const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL!)

      let amountToWithdraw = Number(inputValue) * LAMPORTS_PER_SOL; // Amount to unstake in lamports

      const transaction = new Transaction();

      for (const account of stakeAccount) {
        if (amountToWithdraw <= 0) {
          break;
        }

        const balance = account.account.lamports;


        // Withdraw the stake
        const withdrawInstruction = StakeProgram.withdraw({
          stakePubkey: account.pubkey,
          authorizedPubkey: wallet.publicKey,
          toPubkey: wallet.publicKey,
          lamports: balance, // Withdraw the full balance of the stake account
        });

        transaction.add(withdrawInstruction);

        amountToWithdraw -= balance;
      }

      // Get recent blockhash
      const hash = await connection.getLatestBlockhash();

      transaction.recentBlockhash = hash.blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign and send the transaction
      if (!wallet || !wallet.signTransaction) {
        throw new Error('Wallet is not connected or signTransaction function is not available');
      }
      const signedTransaction = await wallet.signTransaction(transaction);
      const transactionId = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log('Transaction ID:', transactionId);

      await connection.confirmTransaction({
        signature: transactionId,
        blockhash: hash.blockhash,
        lastValidBlockHeight: hash.lastValidBlockHeight,
      }, "finalized");

      setReload((prev) => prev + 1);
      setLoadingTx(false);
      toast.success('Unstaked successfully')
    } catch (error) {
      console.log(error, "error");
      setLoadingTx(false);
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="relative z-50 w-full flex items-center justify-center gap-4 max-w-md mt-10 card p-4 mx-auto bg-brand-bg backdrop-blur-xl bg-opacity-50 border border-white border-opacity-40">
      {/* Calculate Rewards */}
      {
        <div className="w-full flex flex-col items-center justify-center gap-2 p-2 bg-brand-bg bg-opacity-[0.05] backdrop-blur-lg rounded-md border border-white border-opacity-10">
          <div className='w-full flex flex-row items-center justify-center gap-2 '>
            <p>Calculate Reward</p>
          </div>
          <div className="w-full flex flex-row items-center justify-between gap-2 text-xs p-2">
            <div className="flex flex-row items-center justify-center gap-2">
              <p className='font-bold'>Daily:</p>
              <p>{dailyReward > 0 ? dailyReward.toFixed(4) : "-"} <span className='text-[8px]'>SOL</span></p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <p className='font-bold'>Weekly:</p>
              <p>{weeklyReward > 0 ? weeklyReward.toFixed(4) : "-"} <span className='text-[8px]'>SOL</span></p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <p className='font-bold'>Monthly:</p>
              <p>{monthlyReward > 0 ? monthlyReward.toFixed(4) : "-"} <span className='text-[8px]'>SOL</span></p>
            </div>
          </div>
        </div>
      }
      {/* Stake Input */}
      {
        wallet.connected && !loadingStates.stakeAccount ?
          <div className="w-full rounded-md border-opacity-20">
            <div className='flex flex-row items-center justify-center gap-2 '>
              <input
                type="number"
                placeholder='0 SOL'
                className='bg-transparent text-xs w-full flex text-center items-center justify-center input input-bordered border-opacity-10'
                onChange={(e) => {
                  const num = parseFloat(e.target.value);
                  if (num > 0) {
                    setInputValue(e.target.value);
                  } else {
                    setInputValue('');
                  }
                }}
              />
            </div>
          </div> : <input
            type="text"
            placeholder='0 SOL'
            value={inputValue}
            onChange={(e) => {
              const num = parseFloat(e.target.value);
              if (num > 0) {
                setInputValue(e.target.value);
              } else {
                setInputValue('');
              }
            }}
            className='bg-transparent text-center w-full flex items-center justify-center input input-bordered border-opacity-10 py-1 px-2 h-auto'
          />
      }
      {/* Stake Buttons */}
      {
        wallet.connected && !loadingStates.stakeAccount ? (
          <>
            <p className='text-[10px] font-bold opacity-50 bg-black bg-opacity-10 text-center'>Wallet Balance: {balances.yourBalance.toFixed(2) || "X"} SOL</p>
            <div className="w-full ">
              <div className="w-full flex flex-row items-center justify-between gap-2">
                <button disabled={loadingStates.stakeAccount || loadingStates.stakeTx} onClick={handleStake} className='!w-[48%] btn gradientBG text-white disabled:cursor-not-allowed flex flex-row items-center justify-center gap-2'>{loadingStates.stakeTx ? <Spin /> : null}Stake</button>
                {balances.withdrawable === 0 ?
                  <button disabled={loadingStates.stakeAccount || loadingStates.unstakeTx || balances.staked + balances.activating <= 0} onClick={handleDeactivateAll} className='!w-[48%] btn btn-ghost  disabled:cursor-not-allowed flex flex-row items-center justify-center gap-2'>{loadingStates.unstakeTx ? <Spin /> : null}Deactivate All</button>
                  :
                  <button disabled={loadingStates.stakeAccount || loadingStates.unstakeTx} onClick={handleWithdraw} className='!w-[48%] btn btn-ghost  disabled:cursor-not-allowed flex flex-row items-center justify-center gap-2'>{loadingStates.unstakeTx ? <Spin /> : null}Withdraw</button>
                }
              </div>
            </div>
          </>
        ) : null
      }
      {/* Stake Stats */}
      {
        wallet.publicKey ? <>
          <div className="w-full">
            {
              !loadingStates.stakeAccount ?
                <div className='w-full grid grid-cols-2 gap-2 mt-2 '>
                  {!stakeAccount && <p className='text-[8px] opacity-50 w-full text-center'>No Stake Account Yet</p>}
                  {/* <h2>Stake</h2> */}
                  <p className='text-[12px] font-bold opacity-50 bg-black bg-opacity-10 p-0.5 text-center'>Staked: {balances.staked.toFixed(2) || "X"} SOL</p>
                  {balances.deactivating > 0 && <p className='text-[12px] font-bold opacity-50 bg-black bg-opacity-10 p-0.5 text-center'>Deactivating: {balances.deactivating.toFixed(2)} SOL</p>}
                  {balances.activating > 0 && <p className='text-[12px] font-bold opacity-50 bg-black bg-opacity-10 p-0.5 text-center'>Activating: {balances.activating.toFixed(2)} SOL</p>}
                  {balances.withdrawable > 0 && <p className='text-[12px] font-bold opacity-50 bg-black bg-opacity-10 p-0.5 text-center'>Withdrawable: {balances.withdrawable.toFixed(2)} SOL</p>}
                </div>
                :
                <div className="w-full flex items-center justify-center gap-2 py-2 text-xs text-white text-opacity-50">
                  <Spin size='small' /> loading accounts...
                </div>
            }
          </div>
        </> : <></>
      }
      {/* Connect Wallet */}
      {
        !wallet.connected ? <div className='w-full'>
          <MyMultiButton />
        </div> : null
      }
    </div>
  )
}

export default StakingModal