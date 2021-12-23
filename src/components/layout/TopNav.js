import { useState } from 'react'
import {
  Button,
  Flex,
  IconButton,
  Image,
  Spinner,
  Switch,
  useColorMode,
} from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

export default ({ account, isLoading }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const [display, changeDisplay] = useState('none')
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
            {isLoading ? <Spinner /> : <Image src='/logo.svg' height='40px' />}
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

            <NextLink href='/dashboard'>
              <Button variant='ghost' aria-label='Dashboard' my={5} w='100%'>
                Dashboard
              </Button>
            </NextLink>

            <NextLink href='/token'>
              <Button variant='ghost' aria-label='ERC20 Token' my={5} w='100%'>
                ERC20 Token
              </Button>
            </NextLink>

            <NextLink href='/contact'>
              <Button variant='ghost' aria-label='Contact' my={5} w='100%'>
                Contact
              </Button>
            </NextLink>
          </Flex>
        </Flex>

        <Flex justify='flex-end' flex={1}>
          <Flex justify='space-between'>
            {account}
            <Switch
              color='green'
              isChecked={isDark}
              paddingLeft='2em'
              onChange={toggleColorMode}
            />
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
        zIndex={20}
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
