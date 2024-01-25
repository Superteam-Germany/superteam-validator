'use client';

import React, { useEffect, useState } from 'react'
import GradientLine from '../components/GradientLine'
import { Connection, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey } from '@solana/web3.js'

function About() {
  const [stakedSOL, setStakedSOL] = useState(0);

  const stats = [
    { id: 1, name: 'Staked on our validator', value: `${stakedSOL} SOL` },
    { id: 2, name: 'Trusted and experienced team in the ecosystem.', value: 'Est. 2023' },
    { id: 3, name: 'Your staked SOL earns between 7 - 9% APY (Annual Percentage Yield), and compounds the longer it stays staked.', value: 'Earning 7.3%' },
    { id: 4, name: 'Our commission is a low and competitive fee of 5% of your staking rewards.', value: '5% Comission' },
  ]

  useEffect(() => {
    const fetchStakedSOL = async () => {
      const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_URL!, "processed");
      const STAKE_PROGRAM_ID = new PublicKey("Stake11111111111111111111111111111111111111");
      const validatorPubKey = new PublicKey(process.env.NEXT_PUBLIC_VALIDATOR_PUBKEY!);

      const accounts = await connection.getParsedProgramAccounts(STAKE_PROGRAM_ID, {
        filters: [
          {
            dataSize: 200, // number of bytes
          },
          {
            memcmp: {
              offset: 44, // number of bytes
              bytes: validatorPubKey.toBase58(), // base58 encoded string
            },
          },
        ],
      });

      const filteredAccounts = accounts.filter((account) => (account.account.data as ParsedAccountData).parsed.info.stake.delegation.voter === validatorPubKey.toBase58());
      let totalStaked = 0;

      filteredAccounts.forEach(account => {
        const balance = account.account.lamports / LAMPORTS_PER_SOL;
        totalStaked += balance;
      });

      setStakedSOL(totalStaked);
    };

    fetchStakedSOL();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <GradientLine />

      <div className='w-full container max-w-6xl mx-auto flex items-center justify-center'>
        <div className="w-full py-24 sm:py-32">
          <div className="w-full px-6 lg:px-0">
            <div className="w-full">
              <div className="w-full text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">About <span className='gradientText'>Us</span></h2>
                <p className="mt-4 text-lg leading-8 text-gray-300 opacity-50">
                  Trusted and experienced team in the ecosystem.                </p>
              </div>
              <dl className="w-full mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex flex-col items-start justify-start gap-2 bg-white/5  p-8 w-full text-start">
                    <dt className="text-sm font-semibold leading-6 text-gray-300 opacity-50">{stat.name}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-white text-start">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <GradientLine />
    </div>
  )
}

export default About