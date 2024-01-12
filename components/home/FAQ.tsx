'use client'

import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "What is staking?",
    answer: 'Staking is where you assign your "voting rights" to a unique Solana computer, called a validator, and earn a return of about 6.5-8% per year, as of June 2023. Voting rights are simply the ability to vote on a transaction, and each Solana token has these rights. The validator uses them to vote if a transaction was a good or bad transaction. Solana is a "Proof of Stake" blockchain and allows for 1,000s of transactions per second.Often over 4, 500. For comparison, Ethereum can currently process about 15 transactions per second. A validator is a node in the Solana network that votes on which transactions to include in the blockchain.This is similar to a miner in POW(proof of work) based chains like Bitcoin & Ethereum, but since Solana is POS(Proof of Stake), it depends on delegators and their Stake, instead of hash power. Staking is therefore delegating your voting rights to a particular node to help keep the network secure and improve decentralization.Solana validators can not be operated from home, they require significant computing power and internet bandwidth.',
  },
  // More questions...
]

export default function FAQ() {
  return (
    <div className="w-full ">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-100/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-100">Frequently asked questions</h2>
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
                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
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
