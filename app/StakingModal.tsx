'use client'

import React, { useEffect, useState } from 'react'
import MyMultiButton from '../components/MyMultiButton'
import Stats from './Stats'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, StakeProgram, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL, Keypair, Lockup } from '@solana/web3.js'

function StakingModal() {
  const wallet = useWallet()
  const [balance, setBalance] = useState(0)
  const [isOpen, setIsOpen] = useState(false);
  const [stakeAccount, setStakeAccount] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const yearlyRewardRate = 0.0722; // 3% yearly reward

  const dailyReward = (Number(inputValue) * yearlyRewardRate) / 365;
  const weeklyReward = dailyReward * 7;
  const monthlyReward = dailyReward * 30;

  useEffect(() => {
    console.log('Wallet connected:', wallet.connected);
    if (wallet.connected && wallet.publicKey) {
      const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL || 'https://entire-jsandye-fast-mainnet.helius-rpc.com/')
      const validatorPubKey = new PublicKey('73hojLdq1vZDSxeVQEqVFJ4iwLngdvEJPEpEHkSdv6BZ')

      connection.getParsedAccountInfo(wallet.publicKey, 'confirmed')
        .then(accountInfo => {
          console.log('Account info:', accountInfo);
          console.log(accountInfo.value?.lamports)
          if (accountInfo.value?.lamports) {
            let totalBalance = 0;
            totalBalance += (accountInfo.value?.lamports / 10) / LAMPORTS_PER_SOL; // Convert lamports to SOL
            setBalance(totalBalance);
            console.log("Balance" + balance)
          } else {
            setBalance(0);
            console.log('No Stake Account')
          }
        }
        )
        .catch(err => {
          console.error(err);
        })
    }
  }
    , [wallet.connected, wallet.publicKey, stakeAccount, balance])


  const handleStake = async (amount: number) => {
    if (!wallet.publicKey) {
      throw new Error('Wallet public key is null');
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL || 'https://entire-jsandye-fast-mainnet.helius-rpc.com/')
    const validatorPubKey = new PublicKey('73hojLdq1vZDSxeVQEqVFJ4iwLngdvEJPEpEHkSdv6BZ')

    let stakeAccountKey;
    // Create a new stake account if it doesn't exist
    if (!stakeAccount) {
      const stakeAccount = Keypair.generate();
      stakeAccountKey = stakeAccount.publicKey;
      const createStakeAccountInstruction = StakeProgram.createAccount({
        fromPubkey: wallet.publicKey,
        stakePubkey: stakeAccountKey,
        authorized: {
          staker: wallet.publicKey,
          withdrawer: wallet.publicKey,
        },
        lamports: amount * LAMPORTS_PER_SOL,
        lockup: new Lockup(0, 0, wallet.publicKey), // Optional. We'll set this to 0 for demonstration purposes.
      });

      // Add the create account instruction to a transaction
      const transaction = new Transaction();
      transaction.add(createStakeAccountInstruction);

      // Sign and send the transaction
      if (!wallet || !wallet.signTransaction) {
        throw new Error('Wallet is not connected or signTransaction function is not available');
      }
      const signedTransaction = await wallet.signTransaction(transaction);
      const transactionId = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log('Transaction ID:', transactionId);

      // Update the stakeAccount state
      setStakeAccount(stakeAccount);
    } else {
      stakeAccountKey = stakeAccount.publicKey;
    }

    // Delegate stake to the validator
    const delegateInstruction = StakeProgram.delegate({
      stakePubkey: stakeAccountKey,
      authorizedPubkey: wallet.publicKey,
      votePubkey: validatorPubKey,
    });

    // Add the delegate instruction to a transaction
    const transaction = new Transaction();
    transaction.add(delegateInstruction);

    // Sign and send the transaction
    if (!wallet || !wallet.signTransaction) {
      throw new Error('Wallet is not connected or signTransaction function is not available');
    }
    const signedTransaction = await wallet.signTransaction(transaction);
    const transactionId = await connection.sendRawTransaction(signedTransaction.serialize());
    console.log('Transaction ID:', transactionId);
  }

  const handleUnstake = async () => {
    if (!wallet.publicKey || !stakeAccount) {
      throw new Error('Wallet public key is null or stake account is not set');
    }

    const connection = new Connection('https://api.mainnet-beta.solana.com')

    // Deactivate the stake
    const deactivateInstruction = StakeProgram.deactivate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: wallet.publicKey,
    });

    // Withdraw the stake
    const withdrawInstruction = StakeProgram.withdraw({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: wallet.publicKey,
      toPubkey: wallet.publicKey,
      lamports: balance * LAMPORTS_PER_SOL, // Withdraw the full balance at the time of the transaction
    });

    // Add both instructions to a transaction
    const transaction = new Transaction();
    transaction.add(deactivateInstruction);
    transaction.add(withdrawInstruction);

    // Sign and send the transaction
    if (!wallet || !wallet.signTransaction) {
      throw new Error('Wallet is not connected or signTransaction function is not available');
    }
    const signedTransaction = await wallet.signTransaction(transaction);
    const transactionId = await connection.sendRawTransaction(signedTransaction.serialize());
    console.log('Transaction ID:', transactionId);
  }



  return (
    <div className="relative z-50 w-full scale-110 flex items-center justify-center gap-4 max-w-md mt-10 card p-4 mx-auto bg-brand-bg backdrop-blur-xl bg-opacity-50 border border-white border-opacity-40">
      {
        wallet.connected ?
          <div className="w-full rounded-md border-opacity-20">
            <div className='flex flex-row items-center justify-center gap-2 '>
              <input type="text" placeholder='0 SOL' className='bg-transparent text-xs w-full flex text-center items-center justify-center input input-bordered border-opacity-10' />
            </div>
            {
              balance > 0 ? <div className='w-full flex items-center justify-center flex-col gap-0 mt-2'>
                {/* <h2>Stake</h2> */}
                <p className='text-[12px] font-bold opacity-50'>Balance: {balance.toFixed(2) || "X"} SOL</p>
              </div> : <p className='text-[8px] opacity-50 w-full text-center'>No Stake Account Yet</p>
            }
          </div> : null
      }


      {
        !wallet.connected ? null : <div className="w-full border border-white border-opacity-10">
          <div className="w-full flex flex-row items-center justify-between gap-2">
            <button className='!w-[48%] btn gradientBG text-white'>Stake</button>
            <button className='!w-[48%] btn btn-ghost border border-white border-opacity-10'>Unstake</button>
          </div>
        </div>
      }

      <div className="w-full flex flex-col items-center justify-center gap-2 p-2 bg-brand-bg bg-opacity-[0.05] backdrop-blur-lg rounded-md border border-white border-opacity-10">
        <div className='w-full flex flex-row items-center justify-center gap-2 '>
          {
            wallet.connected ? <p>Your Rewards</p> : <input
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
            <p>{dailyReward > 0 ? dailyReward.toFixed(4) : NaN} <span className='text-[8px]'>SOL</span></p>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <p className='font-bold'>Weekly:</p>
            <p>{weeklyReward > 0 ? weeklyReward.toFixed(4) : NaN} <span className='text-[8px]'>SOL</span></p>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <p className='font-bold'>Monthly:</p>
            <p>{monthlyReward > 0 ? monthlyReward.toFixed(4) : NaN} <span className='text-[8px]'>SOL</span></p>
          </div>
        </div>
      </div>
      {
        !wallet.connected ? <div className='w-full'>
          <MyMultiButton />
        </div> : null
      }
    </div>
  )
}

export default StakingModal