import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Head from 'next/head'
import { Web3ReactProvider } from '@web3-react/core'
import { Box, ChakraProvider, useToast } from '@chakra-ui/react'
import { formatEther } from '@ethersproject/units'
import { Web3Provider } from '@ethersproject/providers'
import { Provider } from 'react-redux'

import configureStore from '../store/configureStore.js'
import TopNav from '../components/layout/TopNav.js'

import '../App.css'

const store = configureStore({})

const Dapp = ({ Component, pageProps }) => {
  const toast = useToast()
  const { error, message } = useSelector((state) => state.app)

  useEffect(() => {
    if (message.description) {
      toast({
        title: 'Message',
        description: '',
        status: 'info',
        duration: 15000,
        isClosable: true,
        position: 'top-right',
        ...message,
      })
    }
  }, [message])
  useEffect(() => {
    if (error !== '') {
      toast({
        title: 'Something bad happened :/',
        description: error,
        status: 'error',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
      })
    }
  }, [error])
  return (
    <>
      <TopNav {...pageProps} />
      <Box paddingTop='80px'>
        <Component {...pageProps} />
      </Box>
    </>
  )
}

function getLibrary(provider, connector) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const App = ({ Component, pageProps }) => {
  const props = {
    ...pageProps,
    Component,
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Web3 Stuff | {Component.name}</title>
        <meta name='description' content="Delwiv's Web3 playground" />
        <link rel='icon' href='/logo.svg' />
      </Head>

      <Provider store={store}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Dapp {...props} />
        </Web3ReactProvider>
      </Provider>
    </ChakraProvider>
  )
}

export default App
