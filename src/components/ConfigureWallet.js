import { Box, Heading, Text } from '@chakra-ui/react'

export default () => {
  return (
    <Box>
      <Heading>Waiting for connection</Heading>
      <Text>
        Make sur you have selected Rinkeby Network on your wallet. It seems your
        Web3 wallet is misconfigured. You need to create an account and use the
        Rinkeby Ethereum network. Then you have to accept the connection request
        from Metamask.
      </Text>
    </Box>
  )
}
