import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Heading,
  Input,
  Link,
  Select,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { utils } from 'ethers'

import { abi as erc20Abi } from '../contracts/RocketifyToken.json'

import { useWeb3React } from '@web3-react/core'
import { weiToEther } from '../utils/format.js'
import AmountPicker from './AmountPicker.js'

import { loadTokenData, reloadData } from '../store/actions/web3.js'
import { setError, setLoading, setMessage } from '../store/actions/app.js'

const creatorAddress = '0x624B2ED5B8005B036c71b75065E1b66Afa2b678D'

const RocketifyToken = (props) => {
  const dispatch = useDispatch()

  const [sendTo, setSendTo] = useState('')
  const [name, setName] = useState('')
  const [sendAmount, setSendAmount] = useState(0)
  const [burnAmount, setBurnAmount] = useState(0)
  const {
    eth,
    rocket,
    tokenContract,
    context: { account },
    dataLoaded,
  } = useSelector((state) => state.web3)

  useEffect(() => {
    if (dataLoaded) {
      dispatch(loadTokenData())
    }
  }, [dataLoaded])

  const setUsername = async () => {
    dispatch(setLoading(true))
    try {
      await tokenContract.methods.setName(name).send({ from: account })
      dispatch(
        setMessage({
          title: 'Success',
          description: `You successfuly set your username to ${name}`,
        })
      )
      dispatch(setLoading(false))
      dispatch(reloadData())
    } catch (error) {
      dispatch(setError(error))
      dispatch(setLoading(false))
    }
  }

  const claim = async () => {
    dispatch(setLoading(true))
    try {
      await tokenContract.methods.redeemWelcome().send({ from: account })
      dispatch(setLoading(false))
      dispatch(
        setMessage({
          title: 'Success',
          description: `You successfuly claimed 100 $ROCKET`,
        })
      )
      dispatch(reloadData())
    } catch (error) {
      dispatch(setError(error))
      dispatch(setLoading(false))
    }
  }

  const send = async () => {
    dispatch(setLoading(true))
    console.log({ sendTo, sendAmount })
    try {
      await tokenContract.methods
        .transferRocket(sendTo, `${sendAmount * 10 ** 18}`)
        .send({ from: account })
      dispatch(
        setMessage({
          title: 'Success',
          description: `You successfuly sent ${sendAmount} $ROCKET`,
        })
      )
      dispatch(setLoading(false))
      dispatch(reloadData())
    } catch (error) {
      dispatch(setError(error))
      dispatch(setLoading(false))
    }
  }

  const burn = async () => {
    dispatch(setLoading(true))
    try {
      await tokenContract.methods
        .burn(`${burnAmount * 10 ** 18}`)
        .send({ from: account })
      dispatch(
        setMessage({
          title: 'Success',
          description: `You successfuly burnt ${burnAmount} $ROCKET`,
        })
      )
      dispatch(setLoading(false))
      dispatch(reloadData())
    } catch (error) {
      dispatch(setError(error))
      dispatch(setLoading(false))
    }
  }
  const username = rocket.addresses[account]?.name
  return (
    <div>
      {parseFloat(eth.balance) === 0 && (
        <Box className='sidebar section'>
          <Heading size='lg'>You don't have any Ether</Heading>

          <Text>
            Head over to{' '}
            <Link
              isExternal
              target='_blank'
              color='teal.500'
              href='https://faucets.chain.link/rinkeby'
              rel='noopener noreferrer'
            >
              https://faucets.chain.link/rinkeby <ExternalLinkIcon />
            </Link>
          </Text>
        </Box>
      )}
      <>
        <Box className='sidebar section'>
          <Heading size='lg'>
            {!username ? 'Choose a display name' : `Hello ${username}`}
          </Heading>

          <Input onChange={(e) => setName(e.target.value)} value={name} />
          <Button onClick={setUsername}>Set</Button>
        </Box>
        <Box className='section'>
          <Heading size='lg'>1 - Claim welcome funds</Heading>
          <p>You need to own less than 100 $ROCKET</p>
          <p>(You own {weiToEther(rocket.balance)} $ROCKET)</p>

          <Button disabled={weiToEther(rocket.balance) >= 100} onClick={claim}>
            Claim
          </Button>
        </Box>
        <Box className='section'>
          <Heading size='lg'>2 - Send $ROCKET</Heading>
          <Select
            placeholder='Choose an address'
            onChange={(e) => setSendTo(e.target.value)}
          >
            {rocket.addressesRaw.map((address) => (
              <option value={address} key={address}>
                {address} - {rocket.addresses[address].name}
              </option>
            ))}
          </Select>
          <AmountPicker
            onChange={setSendAmount}
            value={sendAmount}
            myBalance={rocket.balance}
          />
          <Button onClick={send}>Send !</Button>
        </Box>

        <Box className='section'>
          <Heading size='lg'>3 - Burn some $ROCKET</Heading>
          <p>
            Have no friend ? You can burn your tokens to, maybe claim more ?
          </p>

          <AmountPicker
            onChange={setBurnAmount}
            value={burnAmount}
            myBalance={rocket.balance}
          />
          <Button onClick={burn}>Burn !</Button>
        </Box>
        <Box className='section'>
          <Heading size='lg'>4 - Holders</Heading>
          <p>Here are some infos about holders</p>

          <Table>
            <TableCaption>View all accounts stats</TableCaption>
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Name</Th>
                <Th>Balance</Th>
                <Th>Burnt</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rocket.addressesRaw.map((address) => (
                <Tr>
                  <Td className='monospace'>{address}</Td>
                  <Td>{rocket.addresses[address].name}</Td>
                  <Td>{weiToEther(rocket.addresses[address].balance)}</Td>
                  <Td>{weiToEther(rocket.addresses[address].burnt)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </>
    </div>
  )
}

export default RocketifyToken
