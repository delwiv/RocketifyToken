import { Box, Heading, Link, Text } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function Help({ account }) {
  return (
    <Box className='section'>
      <Heading size='md'>To get some test ether</Heading>
      <ul>
        <li>
          go to{' '}
          <Link
            isExternal
            target='_blank'
            color='teal.500'
            href='https://faucets.chain.link/rinkeby'
            rel='noopener noreferrer'
          >
            https://faucets.chain.link/rinkeby <ExternalLinkIcon />{' '}
          </Link>
        </li>
        <li>
          fill your address (<strong>{account}</strong>)
        </li>
        <li>
          check the <strong>0.1 test ETH</strong> and complete the captcha
        </li>
      </ul>
      That's it, you'll recieve your coins in seconds, then you can pay gaz to
      interact here.
      <Text>
        Make sur you have selected Rinkeby Network on your wallet. Then you have
        to accept the connection request from Metamask.
      </Text>
    </Box>
  )
}
