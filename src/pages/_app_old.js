import { useEffect, useState } from 'react'
import { DrizzleContext } from '@drizzle/react-plugin'
import { Drizzle } from '@drizzle/store'
import Head from 'next/head'
import { Box, ChakraProvider, Container, useToast } from '@chakra-ui/react'

import TopNav from '../components/layout/TopNav.js'
import Home from './index.js'
import Help from './help.js'

import drizzleOptions from '../drizzleOptions'
import '../App.css'

const DrizzleWrapper = ({
  Component,
  pageProps,
  setAccount,
  account,
  isLoading,
  setLoading,
}) => {
  const [ethBalance, setEthBalance] = useState(0)
  const [addressCount, setAddressCount] = useState(0)
  const [addresses, setAddresses] = useState([])
  const [RocketifyToken, setTokenContract] = useState(null)
  const [myBalance, setMyBalance] = useState(0)
  const [totalBurn, setTotalBurn] = useState(0)
  const [initialized, setInitialized] = useState(false)
  const [blockchainLoaded, setBlockchainLoaded] = useState(false)
  const [drizzle] = useState(new Drizzle(drizzleOptions))
  const [error, setError] = useState('')
  const [message, setMessage] = useState({})

  const toast = useToast()

  const [names, setNames] = useState([])
  const [burns, setBurns] = useState([])
  const [balances, setBalances] = useState([])

  const [blockchainState, setBlockchainState] = useState({
    accounts: {},
    totalSupply: 0,
    addressCount,
    ethBalance,
    totalBurn,
    myBalance,
    account,
  })

  const getAddressCount = async () =>
    Number(await RocketifyToken.methods.getAddressCount().call())
  const getAddresses = () =>
    Promise.all(
      new Array(addressCount)
        .fill(1)
        .map((_, i) => RocketifyToken.methods.getAddressByIndex(i).call())
    )
  const fetchMyBalance = () => RocketifyToken.methods.getMyBalance().call()
  const fetchTotalBurn = () => RocketifyToken.methods.burnedAmount().call()
  const fetchEthBalance = () => drizzle.web3.eth.getBalance(account)

  const fetchAllBalances = () =>
    Promise.all(
      addresses.map((a) => RocketifyToken.methods.balanceOf(a).call())
    )
  const fetchAllBurns = () =>
    Promise.all(
      addresses.map((a) => RocketifyToken.methods.getBurnByAddress(a).call())
    )
  const fetchAllNames = () =>
    Promise.all(
      addresses.map((a) => RocketifyToken.methods.userNames(a).call())
    )

  const buildState = () =>
    addresses.reduce(
      (acc, cur, i) => {
        acc.accounts[cur] = {
          ...acc[cur],
          balance: balances[i],
          burnt: burns[i],
          name: names[i],
        }
        return acc
      },
      {
        accounts: {},
        totalSupply: 0,
        addressCount,
        ethBalance,
        totalBurn,
        myBalance,
        account,
      }
    )

  useEffect(() => {
    const onInit = async () => {
      setLoading(true)
      setAccount(drizzle.store.getState().accounts[0])
      setTokenContract(drizzle.contracts.RocketifyToken)
      setLoading(false)
    }
    if (initialized) {
      onInit()
    }
  }, [initialized])

  useEffect(() => {
    const onContractLoaded = async () => {
      setLoading(true)
      const [addrCount, balance, totalBurned, rockets] = await Promise.all([
        getAddressCount(),
        fetchEthBalance(),
        fetchTotalBurn(),
        fetchMyBalance(),
      ])
      setAddressCount(addrCount)
      setEthBalance(balance)
      setTotalBurn(totalBurned)
      setMyBalance(rockets)
      setLoading(false)
    }
    if (RocketifyToken) {
      onContractLoaded()
    }
  }, [RocketifyToken])

  useEffect(() => {
    const onAddressCount = async () => {
      setLoading(true)
      const addresses = await getAddresses()
      setAddresses(addresses)
      setLoading(false)
    }
    onAddressCount()
  }, [addressCount])

  const refreshAddresses = async () => {
    setLoading(true)
    setMessage({
      status: 'info',
      title: 'Refreshing',
      description: 'Fetching fresh info from the blockchain...',
      duration: 3000,
    })
    const [balances, burns, names, totalBurned, rockets] = await Promise.all([
      fetchAllBalances(),
      fetchAllBurns(),
      fetchAllNames(),
      fetchTotalBurn(),
      fetchMyBalance(),
    ])

    setBalances(balances)
    setBurns(burns)
    setNames(names)
    setTotalBurn(totalBurned)
    setMyBalance(rockets)
    setLoading(false)
    setMessage({
      status: 'success',
      title: 'Success',
      description: 'The app is up to date',
      duration: 5000,
    })
  }
  useEffect(() => {
    if (addresses.length) {
      refreshAddresses()
    }
  }, [addresses])

  useEffect(() => {
    setBlockchainState(buildState())
  }, [balances, burns, names, addresses, totalBurn, myBalance])

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
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          try {
            const { drizzle, drizzleState, initialized } = drizzleContext

            if (!initialized) {
              return 'Loading...'
            }
            setInitialized(true)

            const props = {
              ...pageProps,
              ...blockchainState,
              drizzle,
              drizzleState,
              setError,
              RocketifyToken,
              setLoading,
              isLoading,
              refreshAddresses,
              setMessage,
            }

            return <Component {...props} />
          } catch (err) {
            setError(err.message)
          }
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  )
}

const App = ({ Component, pageProps }) => {
  const [account, setAccount] = useState('')
  const [isLoading, setLoading] = useState(false)
  const props = {
    ...pageProps,
    account,
    setAccount,
    Component,
    isLoading,
    setLoading,
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Web3 Stuff | {Component.name}</title>
        <meta name='description' content="Delwiv's Web3 playground" />
        <link rel='icon' href='/logo.svg' />
      </Head>

      <TopNav account={account} isLoading={isLoading} />
      <Box paddingTop='80px'>
        {[Home.name, Help.name].includes(Component.name) ? (
          <Component {...props} />
        ) : (
          <DrizzleWrapper {...props} />
        )}
      </Box>
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
