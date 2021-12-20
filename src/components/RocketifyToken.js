import React, { useState, useEffect } from 'react'
import { newContextComponents } from '@drizzle/react-components'

import Account from './Accout.js'
import AllBalances from './AllBalances.js'

const { ContractData, ContractForm } = newContextComponents

const storage = () => typeof window !== 'undefined' ? localStorage : { getItem: () => ([]), setItem: () => {} }
const creatorAddress = '0x624B2ED5B8005B036c71b75065E1b66Afa2b678D'

export default ({ drizzle, drizzleState, setError, ...props }) => {
  const { RocketifyToken } = drizzle.contracts
  const account = drizzleState.accounts[0]
  const storedRecipients = localStorage.getItem('recipients') || ''
  const [sendTo, setSendTo] = useState('')
  const [sendAmount, setSendAmount] = useState(0)
  const [recipients, setRecipients] = useState(storedRecipients.split(';'))
  useEffect(() => {
    storage().setItem('recipients', recipients.join(';'))
  }, [recipients])

  const send = async () => {
    try {
      setError('')
      await RocketifyToken.methods.transferRocket(sendTo, sendAmount).send()
      setRecipients([...recipients, sendTo].filter((val, i, self) => self.indexOf(val) === i))
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <div className='sidebar section'>
        <Account drizzle={drizzle} drizzleState={drizzleState} />
      </div>
      <div className='section'>
        To get some test ether
        <ul>
          <li>go to <a target='_blank' href='https://faucets.chain.link/rinkeby' rel='noopener noreferrer'>https://faucets.chain.link/rinkeby</a></li>
          <li>fill your address (<strong>{account}</strong>)</li>
          <li>
            check the "0.1 test ETH" and complete the captcha
          </li>
        </ul>
        That's it, you'll recieve your coins in seconds, then you can pay gaz to interact here.
      </div>
      <div className='section'>
        <h2>1 - Claim welcome funds</h2>
        <p>You need to own less than 100 $ROCKET</p>
        <p>(You own
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract='RocketifyToken'
            method='getMyBalance'
            render={data => ` ${data / 10 ** 18} $ROCKET`}
          />
          )
        </p>

        <ContractForm
          drizzle={drizzle}
          contract='RocketifyToken'
          method='redeemWelcome'
        />
      </div>
      <div className='section'>

        <h2>2 - Send $ROCKET</h2>
        <p>tip: creator's address = {creatorAddress}</p>
        <p>tip: 15 $ROCKET = {15 * 10 ** 18}</p>
        <input type='text' placeholder='Address' value={sendTo} onChange={e => setSendTo(e.target.value)} />
        <input type='text' placeholder='Amount in $ROCKET' value={sendAmount} onChange={e => setSendAmount(e.target.value)} />
        <button onClick={send}>Send !</button>
      </div>

      <div className='section'>
        <h2>3 - Burn some $ROCKET</h2>
        <p>Have no friend ? You can burn your tokens to, maybe claim more ?</p>

        <ContractForm
          drizzle={drizzle}
          contract='RocketifyToken'
          method='burn'
        />
      </div>
      <div className='section'>
        <AllBalances {...{ drizzle, drizzleState, setError }} />
      </div>
    </div>
  )
}
