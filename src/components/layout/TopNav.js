import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  Spacer,
  Spinner,
  Switch,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react'
import { ChevronDownIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

import NetworkSwitcher from '../utils/NetworkSwitcher.js'
import { setBadChainId } from '../../store/actions/app.js'
import {
  CHAIN_ID,
  changeChainId,
  connectWeb3,
  loadContractData,
  loadTokenContract,
  reloadData,
  setState,
} from '../../store/actions/web3.js'

const InfoItem = ({ label, value }) => (
  <MenuItem>
    <Flex justifyContent='space-between' flex={1}>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </Flex>
  </MenuItem>
)

export default ({ setError, bg }) => {
  const [show, setShow] = useState(false)
  const handleToggle = () => setShow(!show)
  const dispatch = useDispatch()
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const [display, changeDisplay] = useState('none')

  const { loading, badChainId } = useSelector((state) => state.app)
  const {
    context: { account, deactivate, chainId, error, active },
    eth,
    rocket,
    tokenContract,
    dataLoaded,
  } = useSelector((state) => state.web3)

  const web3Context = useWeb3React()

  useEffect(() => {
    dispatch(setState('context', web3Context))

    if (account !== web3Context.account && dataLoaded) {
      dispatch(reloadData())
    }
  }, [web3Context])

  const connect = async () => {
    dispatch(connectWeb3())
  }

  useEffect(() => {
    if (!chainId) {
      return
    }
    if (chainId !== CHAIN_ID) {
      dispatch(setBadChainId(true))
    } else {
      dispatch(setBadChainId(false))
    }
  }, [chainId])

  useEffect(() => {
    if (!error) {
      return
    }
    if (error instanceof UnsupportedChainIdError) {
      return dispatch(setBadChainId(true))
    }
    setError(error.message)
  }, [error])

  useEffect(() => {
    if (!web3Context.active) {
      return
    }
    dispatch(loadTokenContract())
  }, [web3Context.active])

  useEffect(() => {
    if (!tokenContract) {
      return
    }
    dispatch(loadContractData())
  }, [tokenContract])
  return (
    <Flex
      as='nav'
      position='fixed'
      zIndex={1000}
      align='center'
      flex={1}
      width='100%'
      justify='space-between'
      wrap='wrap'
      paddingLeft='1.5rem'
      paddingRight='1.5rem'
      bg={bg}
    >
      <Flex align='center' mr={5}>
        <NextLink href='/'>
          {loading ? <Spinner /> : <Image src='/logo.svg' height='40px' />}
        </NextLink>
      </Flex>
      <Flex align='center' align='flex-start' mr={5}>
        <Box
          display={{ base: show ? 'block' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems='center'
          onClick={() => setShow(false)}
          flexGrow={1}
        >
          <NextLink href='/'>
            <Button variant='ghost' aria-label='Home' my={5} w='100%'>
              Home
            </Button>
          </NextLink>
          <NextLink href='/help'>
            <Button variant='ghost' aria-label='Help' my={5} w='100%'>
              Help
            </Button>
          </NextLink>
          <NextLink href='/token'>
            <Button variant='ghost' aria-label='ERC20 Token' my={5} w='100%'>
              ERC20
            </Button>
          </NextLink>
        </Box>
      </Flex>
      <Box
        display={{ base: show ? 'none' : 'block', md: 'block' }}
        mt={{ base: 4, md: 0 }}
      >
        <Flex justify='space-between' align='center'>
          {badChainId && (
            <NetworkSwitcher onSubmit={() => dispatch(changeChainId())} />
          )}
          {!badChainId && (
            <>{!active && <Button onClick={connect}>Connect</Button>}</>
          )}
          <Menu closeOnSelect={false}>
            {account && (
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {account.slice(0, 8)}...
              </MenuButton>
            )}
            <MenuList>
              <MenuGroup title='Wallet'>
                <InfoItem
                  label='$ETHEREUM'
                  value={parseFloat(eth.balance).toFixed(2)}
                />
                <InfoItem label='$ROCKET' value={rocket.balance / 10 ** 18} />
              </MenuGroup>
              <MenuGroup title='$ROCKET stats'>
                <InfoItem
                  label='Total supply'
                  value={(rocket.totalSupply / 10 ** 18).toFixed(2)}
                />
                <InfoItem
                  label='Total burnt'
                  value={(rocket.totalBurnt / 10 ** 18).toFixed(2)}
                />
              </MenuGroup>
              <MenuItem>
                <FormControl display='flex' alignItems='center'>
                  <FormLabel htmlFor='themeSwitcher' mb='0'>
                    Use dark theme ?
                  </FormLabel>
                  <Switch
                    color='green'
                    isChecked={isDark}
                    paddingLeft='2em'
                    onChange={toggleColorMode}
                  />
                </FormControl>
              </MenuItem>
              <MenuItem>
                {active && (
                  <Button
                    onClick={() => {
                      deactivate()
                      location.reload()
                    }}
                  >
                    Disconnect
                  </Button>
                )}
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <Box display={{ base: 'block', md: 'none' }} onClick={handleToggle}>
        <Box position='absolute' top='2em' right='2em'>
          <svg
            fill='white'
            width='12px'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Menu</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
          </svg>
        </Box>
      </Box>
    </Flex>
  )
}
