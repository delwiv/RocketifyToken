import React, { useState } from 'react'
import { Box, Button, Heading, Select, Text } from '@chakra-ui/react'
import { newContextComponents } from '@drizzle/react-components'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import Account from './Accout.js'
import AllBalances from './AllBalances.js'
import { weiToEther } from '../utils/format.js'
import AmountPicker from './AmountPicker.js'

const { ContractData, ContractForm } = newContextComponents

const creatorAddress = '0x624B2ED5B8005B036c71b75065E1b66Afa2b678D'

const RocketifyToken = (props) => {
  const {
    refreshAddresses,
    isLoading,
    setLoading,
    RocketifyToken,
    account,
    accounts,
    drizzle,
    drizzleState,
    setError,
    myBalance,
    setMessage,
  } = props

  const [sendTo, setSendTo] = useState('')
  const [sendAmount, setSendAmount] = useState(0)
  const [burnAmount, setBurnAmount] = useState(0)

  const claim = async () => {
    try {
      setError('')
      await RocketifyToken.methods.redeemWelcome().send()
      setMessage({
        title: `Claim succeeded`,
        description: `Successfuly minted 100 $ROCKET, they were sent to your wallet`,
        status: 'success',
      })
      refreshAddresses()
    } catch (error) {
      setError(error.message)
    }
  }

  const send = async () => {
    try {
      setLoading(true)
      await RocketifyToken.methods
        .transferRocket(sendTo, `${sendAmount * 10 ** 18}`)
        .send()
      setMessage({
        title: `Transfer succeeded`,
        description: `Successfuly sent ${sendAmount} $ROCKET to ${sendTo}`,
        status: 'success',
      })
      setLoading(false)
      refreshAddresses()
      setSendAmount(0)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const burn = async () => {
    try {
      setLoading(true)
      await RocketifyToken.methods.burn(`${burnAmount * 10 ** 18}`).send()
      setMessage({
        title: `Burn succeeded`,
        description: `Successfuly burnt ${burnAmount} $ROCKET`,
        status: 'success',
      })
      setLoading(false)
      setBurnAmount(0)
      refreshAddresses()
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <div>
      <Box className='sidebar section'>
        <Account {...props} />
      </Box>
      <Box className='section'>
        <Heading size='lg'>1 - Claim welcome funds</Heading>
        <p>You need to own less than 100 $ROCKET</p>
        <p>(You own {weiToEther(myBalance)} $ROCKET)</p>

        <Button onClick={claim}>Claim</Button>
      </Box>
      <Box className='section'>
        <Heading size='lg'>2 - Send $ROCKET</Heading>
        <Select
          placeholder='Choose an address'
          onChange={(e) => setSendTo(e.target.value)}
        >
          {Object.keys(accounts)
            .filter((addr) => addr !== account)
            .map((addr) => (
              <option key={addr} value={addr}>
                {`${addr} | ${accounts[addr].name || 'Unkown'}`}{' '}
              </option>
            ))}
        </Select>
        <AmountPicker
          onChange={setSendAmount}
          value={sendAmount}
          myBalance={myBalance}
        />
        <Button onClick={send}>Send !</Button>
      </Box>

      <Box className='section'>
        <Heading size='lg'>3 - Burn some $ROCKET</Heading>
        <p>Have no friend ? You can burn your tokens to, maybe claim more ?</p>

        <AmountPicker
          onChange={setBurnAmount}
          value={burnAmount}
          myBalance={myBalance}
        />
        <Button onClick={burn}>Burn !</Button>
      </Box>
      <Box className='section'>
        <AllBalances {...props} />
      </Box>
    </div>
  )
}

export default RocketifyToken
