'use client'

import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "What is staking?",
    answer: 'Staking is where you assign your voting rights to a unique Solana computer, called a validator, and earn a return of about 6.5-8% per year, as of June 2023. Voting rights are simply the ability to vote on a transaction, and each Solana token has these rights. The validator uses them to vote if a transaction was a good or bad transaction. Solana is a Proof of Stake blockchain and allows for 1,000s of transactions per second. Often over 4, 500. For comparison, Ethereum can currently process about 15 transactions per second. A validator is a node in the Solana network that votes on which transactions to include in the blockchain. This is similar to a miner in POW(proof of work) based chains like Bitcoin & Ethereum, but since Solana is POS(Proof of Stake), it depends on delegators and their Stake, instead of hash power. Staking is therefore delegating your voting rights to a particular node to help keep the network secure and improve decentralization.Solana validators can not be operated from home, they require significant computing power and internet bandwidth.',
  },
  {
    question: "Does the earned SOL compound?",
    answer: 'Yes. It compounds automatically with every epoch.',
  },
  {
    question: "Is it safe to stake my SOL?",
    answer: 'Yes. The Solana software has been audited(where computer engineers check the program code) by Kudelski, a leading cybersecurity firm.Solana Labs also has bug bounties, so anything a developer finds, they can submit and receive a financial reward. You can always withdraw your Stake from the validator, and a validator cant take your SOL. Our validator is hosted professionally with enterprise-level computing servers. Even if the power went down and the server turned off, you can still withdraw your SOL. We never have your SOL, only the voting rights that you can withdraw at any stage.',
  },
  {
    question: "Why should I stake with SuperteamDE?",
    answer: 'SuperteamDE has massive goals to push the Solana ecosystem forward. Our team is bent on education for everyone, and we welcome anyone to stake with us.You may be new to Solana, and have 1 SOL in your wallet, or a company with 250,000 SOL, we are the choice for you. Our upcoming “alpha” blog keeps you in the know.You have a busy life.You want to know how to stake, why Solana, and ecosystem updates in a concise form. You would earn 6.5 - 8 % a year on your SOL, and commission is a low 5% of your staking rewards.',
  },
  {
    question: "How long is my SOL locked up for?",
    answer: 'Your staked SOL goes through a few phases. With Solana, the minimum delegation time is one epoch. An epoch is a period in time in computing, and in Solana, it is about 2.5 days. To see the progress on the epoch you can visit Solana Beach and it shows you the epoch number, ETA until end, and the progress as a percentage. The lock up on Solana is for just 1 epoch.Some other blockchains, like in Cosmos, have 20+ day lockups. Activating: When you delegate SOL, eg 1 SOL, it will show as “activating” until the epoch changes to the next one.During activating, no SOL earns rewards.',
  },
  {
    question: "How often do I receive rewards?",
    answer: 'When you have been staked for 1 epoch, you will be credited with rewards at the end of the epoch.',
  },
  {
    question: "What are Superteam fees?",
    answer: 'Our Validator charges 5% commission from any new SOL earned from staking.',
  },
  {
    question: "Where are can I see my rewards?",
    answer: 'Solana staking is compounded, automatically, with no option to withdraw the rewards. So if you staked 1000 SOL, it would grow at about 1.1 SOL per week. At the end of the year, you would have around 1060 SOL. Phantom only shows you your rewards for the most recent epoch in Phantom. A more comprehensive solution is Solstake.After each epoch, it will show you each reward, and your staked SOL balance will grow epoch by epoch.',
  },
  {
    question: "How much SOL should I delegate?",
    answer: 'As much, or as little, as you like. It is also a good idea to do it in multiple batches. eg you might have 100 SOL to delegate. Do 5 x 20 SOL delegations. That way, should you ever need some SOL, you can unstake 1x 20 SOL delegation, and earn rewards on the 80 SOL still. If you have 0.5 SOL, you can stake that too.',
  },
  {
    question: "How do I Unstake?",
    answer: 'Unstaking is easy, and is two-step process which includes: Unstaking + withdrawing. You will need some SOL for the transaction cost (called gas). 0.01 SOL is enough, and if using Phantom wallet, follow this: Unstaking Click on your Solana token balance in your wallet. Click the "Your Stake" row. Choose the Validator.com staking account you wish to unstake. Click the purple "Unstake" button in the bottom right. This will deactivate the Stake, and when the epoch ends(you can check the epoch length at Solana Beach or Solstake, you can withdraw). Withdrawing: If your Validator.com staking account status is "Inactive", you can withdraw your SOL back into your wallet. Click on your Solana token balance in your wallet. Choose the Validator.com staking account you wish to withdraw from. Click the 3 dots "..." in the top right. Click "Withdraw SOL".',
  },
  {
    question: "What does rent reserve mean?",
    answer: 'Rent is a standard "deposit" that all delegators pay each time a new stake is created. It is part of the Solana software, and when you eventually unstake, you get it back. It’s a very small amount of SOL. Just think of it as a refundable deposit.',
  },
  {
    question: "What server is the validator running on?",
    answer: 'The validator is managed and ran by Staking Facilities (link), one of the most experienced infrastructure teams in Solana. It is a bare metal server, running in a secure datacenter in Germany.',
  },
  {
    question: "Can slashing take my SOL?",
    answer: 'You may have heard of slashing, which is used with some other Proof of Stake blockchains. When a validator is malicious(approving fake transactions and double- spending), their Stake can be reduced, which is bad for investors and encourages the validator to be honest.Slashing is not live on Solana, its likely years away, and good validators would not be affected, as they dont misbehave.We are a great validator, and we have our own SOL staked, so we play by the rules, and protect the network.',
  },
  {
    question: "How can I download a report of my earnings?",
    answer: 'The validator is managed and ran by Staking Facilities (link), one of the most experienced infrastructure teams in Solana. It is a bare metal server, running in a secure datacenter in Germany.',
  },
  {
    question: "Where do I go for extra help?",
    answer: 'You can always reach out on Twitter or Discord. These links are at the bottom of our website. We can’t offer this to every potential staker, but if you have a sizeable SOL portfolio, or are looking to get that, we can organize a video chat with our General Manager, to talk you through the additional security aspects, such as using a Ledger hardware wallet, and answer any questions.',
  },
  // More questions...
]

export default function FAQ() {
  return (
    <div className="w-full ">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-100/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-100"><span className='gradientText'>F</span>requently <span className='gradientText'>A</span>sked <span className='gradientText'>Q</span>uestions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-100/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }: any) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-100">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-400">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
