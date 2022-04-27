import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
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

export default ({ setError }) => {
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
    <Flex id='navbar'>
      <Flex
        position='fixed'
        top='0'
        left='1rem'
        justify='space-between'
        width='97%'
        align='center'
      >
        <Flex
          flex={1}
          align='center'
          display={['none', 'none', 'flex', 'flex']}
        >
          <NextLink href='/'>
            {loading ? <Spinner /> : <Image src='/logo.svg' height='40px' />}
          </NextLink>
          {/* Mobile */}
          <IconButton
            aria-label='Open Menu'
            size='lg'
            mr={2}
            icon={<HamburgerIcon />}
            onClick={() => changeDisplay('flex')}
            display={['flex', 'flex', 'none', 'none']}
          />
          {/* Desktop */}
          <Flex>
            <NextLink href='/'>
              <Button variant='ghost' aria-label='Home' my={5} w='100%'>
                Home
              </Button>
            </NextLink>

            {/*<NextLink href='/dashboard'>
              <Button variant='ghost' aria-label='Dashboard' my={5} w='100%'>
                Dashboard
              </Button>
            </NextLink>


            {/*<NextLink href='/bookmaker'>
              <Button variant='ghost' aria-label='Bookmaker' my={5} w='100%'>
                Bookmaker
              </Button>
            </NextLink>*/}
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
          </Flex>
        </Flex>

        <Flex justify='flex-end' flex={1}>
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
        </Flex>
      </Flex>

      {/* Mobile Content */}
      <Flex
        w='100vw'
        display={display}
        bgColor='gray.50'
        zIndex={20}
        h='100vh'
        pos='fixed'
        top='0'
        left='0'
        overflowY='auto'
        flexDir='column'
      >
        <Flex justify='flex-end'>
          <IconButton
            mt={2}
            mr={2}
            aria-label='Open Menu'
            size='lg'
            icon={<CloseIcon />}
            onClick={() => changeDisplay('none')}
          />
        </Flex>

        <Flex flexDir='column' align='center'>
          <NextLink href='/' passHref>
            <Button as='a' variant='ghost' aria-label='Home' my={5} w='100%'>
              Home
            </Button>
          </NextLink>

          <NextLink href='/about' passHref>
            <Button as='a' variant='ghost' aria-label='About' my={5} w='100%'>
              About
            </Button>
          </NextLink>

          <NextLink href='/contact' passHref>
            <Button as='a' variant='ghost' aria-label='Contact' my={5} w='100%'>
              Contact
            </Button>
          </NextLink>
        </Flex>
      </Flex>
    </Flex>
  )
}
