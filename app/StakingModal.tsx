'use client'

import React, { useEffect, useState } from 'react'
import MyMultiButton from '../components/MyMultiButton'
import Stats from './Stats'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, StakeProgram, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL, Keypair, Lockup, clusterApiUrl, ParsedAccountData, AccountInfo } from '@solana/web3.js'
import { Spin } from 'antd'
import { toast } from 'sonner'

function StakingModal() {
  const wallet = useWallet()
  const [balances, setBalances] = useState({
    staked: 0,
    activating: 0,
    deactivating: 0,
    withdrawable: 0
  });
  const [stakeAccount, setStakeAccount] = useState<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  } | null>(null);

  console.log(stakeAccount, "stakeAccount");

  const [isLoadingStakeAccount, setLoadingStakeAccount] = useState(false);
  const [isLoadingTx, setLoadingTx] = useState(false);
  const [reload, setReload] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const yearlyRewardRate = 0.0722; // 3% yearly reward

  const dailyReward = (Number(inputValue) * yearlyRewardRate) / 365;
  const weeklyReward = dailyReward * 7;
  const monthlyReward = dailyReward * 30;

  useEffect(() => {
    const validatorPubKey = new PublicKey(process.env.NEXT_PUBLIC_VALIDATOR_PUBKEY!);
    const STAKE_PROGRAM_ID = new PublicKey(
      "Stake11111111111111111111111111111111111111"
    );

    async function getStakeAccount() {
      try {
        setLoadingStakeAccount(true);

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

        console.log(accounts, "accounts");
        console.log(await connection.getEpochInfo(), "connection.getEpochInfo")

        const filteredAccounts = accounts.filter((account) => (account.account.data as ParsedAccountData).parsed.info.stake.delegation.voter === validatorPubKey.toBase58());
        if (filteredAccounts.length) {
          setStakeAccount(filteredAccounts[0])
          const balance = filteredAccounts[0].account.lamports / LAMPORTS_PER_SOL;

          const stakeAcountData = filteredAccounts[0].account.data as ParsedAccountData;

          const activationEpoch = stakeAcountData.parsed.info.stake.delegation.activationEpoch;
          const deactivationEpoch = stakeAcountData.parsed.info.stake.delegation.deactivationEpoch;

          let staked = 0;
          let activating = 0;
          let deactivating = 0;
          let withdrawable = 0;

          if (epoch.epoch <= activationEpoch) {
            activating = balance;
          } else if (epoch.epoch < deactivationEpoch) {
            deactivating = balance;
          } else if (epoch.epoch >= activationEpoch && deactivationEpoch === "18446744073709551615") {
            staked = balance;
          } else if (epoch.epoch > activationEpoch && deactivationEpoch !== "18446744073709551615") {
            withdrawable = balance;
          }

          setBalances({
            staked,
            activating,
            deactivating,
            withdrawable
          })
        }
        setLoadingStakeAccount(false);
      } catch (error) {
        console.log(error, "error")
        setLoadingStakeAccount(false);
      }
    }
    if (wallet.publicKey) {
      getStakeAccount();
    }
  }, [wallet.publicKey, reload])

  console.log(stakeAccount, "stakeAccount")

  const handleStake = async () => {
    try {
      if (!wallet.publicKey) {
        throw new Error('Wallet public key is null');
      }

      setLoadingTx(true);

      const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL!, { commitment: "finalized" })
      const validatorPubKey = new PublicKey(process.env.NEXT_PUBLIC_VALIDATOR_PUBKEY!)
      let transaction = new Transaction();
      let stakeAccountKey;
      let newStakeAccountKP;
      // Create a new stake account if it doesn't exist
      if (!stakeAccount) {
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



        // Update the stakeAccount state
      } else {
        stakeAccountKey = stakeAccount.pubkey;
        console.log('Using existing stake account', stakeAccountKey)
      }

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

      setReload((prev) => prev++);
      setLoadingTx(false);
      toast.success('Staked successfully')
    } catch (error) {
      console.log(error, "error");
      setLoadingTx(false);
      toast.error((error as Error).message);
    }
  }

  const handleUnstake = async () => {
    try {
      if (!wallet.publicKey || !stakeAccount) {
        throw new Error('Wallet public key is null or stake account is not set');
      }

      if (!stakeAccount) {
        throw new Error('No Stakeaccount');
      }

      setLoadingTx(true);

      const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL!, { commitment: "finalized" })

      // Deactivate the stake
      const deactivateInstruction = StakeProgram.deactivate({
        stakePubkey: stakeAccount.pubkey,
        authorizedPubkey: wallet.publicKey,
      });

      // Withdraw the stake
      const withdrawInstruction = StakeProgram.withdraw({
        stakePubkey: stakeAccount.pubkey,
        authorizedPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: Number(inputValue) * LAMPORTS_PER_SOL, // Withdraw the full balance at the time of the transaction
      });

      // Add both instructions to a transaction
      const transaction = new Transaction();
      transaction.add(deactivateInstruction);
      transaction.add(withdrawInstruction);

      // Get recent blockhash
      const hash = await connection.getLatestBlockhash();

      transaction.recentBlockhash = hash.blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign and send the transaction
      if (!wallet || !wallet.signTransaction) {
        throw new Error('Wallet is not connected or signTransaction function is not available');
      }
      const signedTransaction = await wallet.signTransaction(transaction);
      const transactionId = await connection.sendRawTransaction(signedTransaction.serialize(), { skipPreflight: true });
      console.log('Transaction ID:', transactionId);

      setReload((prev) => prev++);
      setLoadingTx(false);
      toast.success('Unstaked successfully')
    } catch (error) {
      console.log(error, "error");
      setLoadingTx(false);
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="relative z-50 w-full scale-110 flex items-center justify-center gap-4 max-w-md mt-10 card p-4 mx-auto bg-brand-bg backdrop-blur-xl bg-opacity-50 border border-white border-opacity-40">
      {/* Calculate Rewards */}
      {
        !wallet.publicKey ? <div className="w-full flex flex-col items-center justify-center gap-2 p-2 bg-brand-bg bg-opacity-[0.05] backdrop-blur-lg rounded-md border border-white border-opacity-10">
          <div className='w-full flex flex-row items-center justify-center gap-2 '>
            {
              wallet.connected ? <p>Calculate Rewards</p> : <input
                type="text"
                placeholder='Calculate Rewards'
                value={inputValue}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  if (num >= 0) {
                    setInputValue(e.target.value);
                  }
                }}
                className='bg-transparent text-center w-full flex items-center justify-center input input-bordered border-opacity-10 py-1 px-2 h-auto'
              />
            }
          </div>
          <div className="w-full flex flex-row items-center justify-between gap-2 text-xs p-2">
            <div className="flex flex-row items-center justify-center gap-2">
              <p className='font-bold'>Daily:</p>
              <p>{dailyReward > 0 ? dailyReward.toFixed(2) : "-"} <span className='text-[8px]'>SOL</span></p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <p className='font-bold'>Weekly:</p>
              <p>{weeklyReward > 0 ? weeklyReward.toFixed(2) : "-"} <span className='text-[8px]'>SOL</span></p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <p className='font-bold'>Monthly:</p>
              <p>{monthlyReward > 0 ? monthlyReward.toFixed(2) : "-"} <span className='text-[8px]'>SOL</span></p>
            </div>
          </div>
        </div> : null
      }
      {/* Stake Input */}
      {
        wallet.connected && !isLoadingStakeAccount ?
          <div className="w-full rounded-md border-opacity-20">
            <div className='flex flex-row items-center justify-center gap-2 '>
              <input
                type="number"
                placeholder='0 SOL'
                className='bg-transparent text-xs w-full flex text-center items-center justify-center input input-bordered border-opacity-10'
                onChange={(e) => {
                  const num = Number(e.target.value);
                  if (!isNaN(num) && num > 0) {
                    setInputValue(e.target.value);
                  }
                }}
              />
            </div>
          </div> : null
      }
      {/* Stake Buttons */}
      {
        wallet.connected && !isLoadingStakeAccount ? (
          <div className="w-full border border-white border-opacity-10">
            <div className="w-full flex flex-row items-center justify-between gap-2">
              <button disabled={isLoadingStakeAccount || isLoadingTx} onClick={handleStake} className='!w-[48%] btn gradientBG text-white disabled:cursor-not-allowed flex flex-row items-center justify-center gap-2'>{isLoadingTx ? <Spin /> : null}Stake</button>
              <button disabled={isLoadingStakeAccount || isLoadingTx} onClick={handleUnstake} className='!w-[48%] btn btn-ghost border border-white border-opacity-10 disabled:cursor-not-allowed flex flex-row items-center justify-center gap-2'>{isLoadingTx ? <Spin /> : null}Unstake</button>
            </div>
          </div>
        ) : null
      }
      {/* Stake Stats */}
      {
        wallet.publicKey ? <>
          <div className="w-full">
            {
              !isLoadingStakeAccount ?
                <div className='w-full grid grid-cols-2 gap-2 mt-2 '>
                  {!stakeAccount && <p className='text-[8px] opacity-50 w-full text-center'>No Stake Account Yet</p>}
                  {/* <h2>Stake</h2> */}
                  <p className='text-[12px] font-bold opacity-50 bg-black bg-opacity-10 p-0.5 text-center'>Staked: {balances.staked.toFixed(2) || "X"} SOL</p>
                  {balances.activating > 0 && <p className='text-[12px] font-bold opacity-50 bg-black bg-opacity-10 p-0.5 text-center'>Activating: {balances.activating.toFixed(2)} SOL</p>}
                  {balances.deactivating > 0 && <p className='text-[12px] font-bold opacity-50 bg-black bg-opacity-10 p-0.5 text-center'>Deactivating: {balances.deactivating.toFixed(2)} SOL</p>}
                  {balances.withdrawable > 0 && <p className='text-[12px] font-bold opacity-50 bg-black bg-opacity-10 p-0.5 text-center'>Ready to withdraw: {balances.withdrawable.toFixed(2)} SOL</p>}
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