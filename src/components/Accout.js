import React, { useState, useEffect } from 'react'
import { Box, Text, Heading, FormControl, Flex, Input, Button, Spinner } from '@chakra-ui/react'

import { weiToEther } from '../utils/format.js'

export default ({ setError, account, ethBalance, myBalance, accounts, setMessage, RocketifyToken, setLoading, refreshAddresses }) => {
  const fullAccount = accounts[account] || { name: '', burnt: 0 }
  const [name, setName] = useState(fullAccount.name)
  const sendSetUsername = async () => {
    try {
      setLoading(true)
      await RocketifyToken.methods.setName(name).send()
      setLoading(false)
      setMessage({
        title: `Hello ${name} :-)`,
        description: 'Your name has been successfuly set',
        status: 'success'
      })
      refreshAddresses()
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <>
      <Heading size='lg'>Account </Heading>
      <Heading size='md'>{fullAccount.name && `Custom name : ${fullAccount.name}`}</Heading>
      <Heading size='sm' className='monospace'>{account}</Heading>
      <FormControl>
        <Heading size='md'>Want to set or change your username ?</Heading>
        <Flex>
          <Input flex={1} name='name' placeholder='Name' onChange={e => setName(e.target.value)} />
          <Button onClick={() => sendSetUsername()}>Set name</Button>
        </Flex>
      </FormControl>

      <Text>{weiToEther(ethBalance).toFixed(10)} $ETHEREUM</Text>
      <Text>{weiToEther(myBalance).toFixed(10)} $ROCKET</Text>

      <Heading size='md'>Burnt</Heading>
      <Text>{weiToEther(fullAccount.burnt)} $ROCKET</Text>
    </>
  )
}
