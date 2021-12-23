import React, { useEffect, useState } from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

import { shortAddress, weiToEther } from '../utils/format.js'

export default ({ accounts, account, setError, addressCount, totalBurn }) => {
  return (
    <Box className='allBalances'>
      <Heading size='lg'>All accounts</Heading>
      <Heading size='md'>Address count</Heading>
      {addressCount} addresses registered
      <Heading size='md'>Balances</Heading>
      {Object.keys(accounts).map((address) => (
        <div key={address} className='addressList'>
          <span className='address' title={accounts[address].name}>
            {address}
          </span>
          <Text>{weiToEther(accounts[address].balance)} $ROCKET</Text>
        </div>
      ))}
      <Heading size='md'>Burnt</Heading>
      <Text>Total :{weiToEther(totalBurn)} $ROCKET</Text>
      {Object.keys(accounts).map((address) => (
        <div key={address} className='addressList'>
          <span className='address' title={accounts[address].name}>
            {address}
          </span>
          <Text>{weiToEther(accounts[address].burnt)} $ROCKET</Text>
        </div>
      ))}
    </Box>
  )
}
