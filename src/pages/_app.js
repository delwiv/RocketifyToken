import { useState, useEffect } from 'react'
import { DrizzleContext } from '@drizzle/react-plugin'
import { Drizzle } from '@drizzle/store'
import Head from 'next/head'
import { ChakraProvider, Container, Box } from '@chakra-ui/react'

import TopNav from '../components/layout/TopNav.js'

import drizzleOptions from '../drizzleOptions'
import '../App.css'

let drizzle
const DrizzleWrapper = ({ Component, pageProps, setAccount, setError }) => {
  if (!drizzle) {
    drizzle = new Drizzle(drizzleOptions)
  }
  try {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            try {
              const { drizzle, drizzleState, initialized } = drizzleContext

              if (!initialized) {
                return 'Loading...'
              }

              setAccount(drizzleState.accounts[0])
              return (
                <Component {...pageProps} drizzle={drizzle} drizzleState={drizzleState} setError={setError} />
              )
            } catch (err) {
              setError(err.message)
            }
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>

    )
  } catch (err) {
    setError(err.message)
  }
}

const App = ({ Component, pageProps }) => {
  const [account, setAccount] = useState('')
  const [error, setError] = useState('')
  return (
    <ChakraProvider>
      <Head>
        <title>Web3 Stuff | {Component.name}</title>
        <meta name='description' content="Delwiv's Web3 playground" />
        <link rel='icon' href='/logo.svg' />
      </Head>

      <TopNav account={account} />
      <Container paddingTop='80px'>
        <Box>{error}</Box>
        {Component.name === 'Home'
          ? <Component {...pageProps} setError={setError} />
          : <DrizzleWrapper Component={Component} setError={setError} pageProps={pageProps} setAccount={setAccount} />}
      </Container>
      {/* <footer>
          Powered by{' '}
          <span>
            <Image src='/logo.svg' alt='Rocketify Logo' width={72} height={16} />
          </span>
        </footer> */}
    </ChakraProvider>
  )
}

export default App
