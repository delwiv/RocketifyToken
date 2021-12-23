import React, { useState, useEffect } from 'react'
import { newContextComponents } from '@drizzle/react-components'
import { Select, Flex, FormControl, Box, Text, Heading, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Button, Input, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import Account from './Accout.js'
import AllBalances from './AllBalances.js'
import { weiToEther } from '../utils/format.js'

const { ContractData, ContractForm } = newContextComponents

const creatorAddress = '0x624B2ED5B8005B036c71b75065E1b66Afa2b678D'

export default (props) => {
  const { refreshAddresses, isLoading, setLoading, RocketifyToken, account, accounts, drizzle, drizzleState, setError, myBalance } = props

  const [sendTo, setSendTo] = useState('')
  const [sendAmount, setSendAmount] = useState(0)

  const claim = async () => {
    try {
      setError('')
      await RocketifyToken.methods.redeemWelcome().send()
    } catch (error) {
      setError(error.message)
    }
  }

  const send = async () => {
    try {
      setLoading(true)
      await RocketifyToken.methods.transferRocket(sendTo, sendAmount).send()
      setLoading(false)
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
        <Heading size='md'>To get some test ether</Heading>
        <ul>
          <li>go to <Link isExternal target='_blank' color='teal.500' href='https://faucets.chain.link/rinkeby' rel='noopener noreferrer'>https://faucets.chain.link/rinkeby <ExternalLinkIcon /> </Link></li>
          <li>fill your address (<strong>{account}</strong>)</li>
          <li>
            check the "0.1 test ETH" and complete the captcha
          </li>
        </ul>
        That's it, you'll recieve your coins in seconds, then you can pay gaz to interact here.
      </Box>
      <Box className='section'>
        <Heading size='lg'>1 - Claim welcome funds</Heading>
        <p>You need to own less than 100 $ROCKET</p>
        <p>(You own {weiToEther(myBalance)} $ROCKET)</p>

        <Button onClick={claim}>Claim</Button>
      </Box>
      <Box className='section'>

        <Heading size='lg'>2 - Send $ROCKET</Heading>
        <Text>tip: creator's address <span className='monospace'>{creatorAddress}</span></Text>
        <Text>tip: 15 $ROCKET = <span className='monospace'>{15 * 10 ** 18}</span></Text>
        <Select placeholder='Choose an address' onChange={e => setSendTo(e.target.value)}>
          {Object.keys(accounts).filter(addr => addr !== account).map(addr => (
            <option value={addr}>{`${addr} | ${accounts[addr].name || 'Unkown'}`} </option>
          ))}
        </Select>
        <Select placeholder='Choose an amount' onChange={e => setSendAmount(e.target.value)}>
          <option value={25 * 10 ** 18}>25 $ROCKET </option>
          <option value={50 * 10 ** 18}>50 $ROCKET </option>
          <option value={100 * 10 ** 18}>100 $ROCKET </option>
        </Select>
        <Slider onChange={val => setSendAmount(val)} defaultValue={15} min={0} max={weiToEther(myBalance)}>
          <SliderMark value={0} mt='1' ml='-2.5' fontSize='sm'>
            0
          </SliderMark>
          <SliderMark value={weiToEther(myBalance) / 2} mt='1' ml='-2.5' fontSize='sm'>
            {weiToEther(myBalance) / 2}
          </SliderMark>
          <SliderMark value={weiToEther(myBalance)} mt='1' ml='-2.5' fontSize='sm'>
            {weiToEther(myBalance)}
          </SliderMark>
          <SliderMark
            value={sendAmount}
            textAlign='center'
            bg='red.500'
            color='white'
            zIndex={60000}
            marginTop={-35}

          >
            {sendAmount} $ROCKET
          </SliderMark>
          <SliderTrack bg='red.100'>
            <Box position='relative' right={10} />
            <SliderFilledTrack bg='tomato' />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>
        <Button onClick={send}>Send {sendAmount} $ROCKET!</Button>
      </Box>

      <Box className='section'>
        <Heading size='lg'>3 - Burn some $ROCKET</Heading>
        <p>Have no friend ? You can burn your tokens to, maybe claim more ?</p>

        <ContractForm
          drizzle={drizzle}
          contract='RocketifyToken'
          method='burn'
        />
      </Box>
      <Box className='section'>
        <AllBalances {...props} />
      </Box>
    </div>
  )
}
