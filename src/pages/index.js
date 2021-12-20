import { Text, Heading, Box, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function Home (props) {
  return (
    <>
      <Heading>Delwiv's Web3 Lab</Heading>
      <Box>
        <Text>This app hosts a few projects I made while learning Web3 stack. To explore these Web3 apps, you need a Web3 wallet, like <Link href='https://metamask.io' color='teal.500' isExternal>Metamask <ExternalLinkIcon mx='2px' /></Link></Text>
      </Box>
    </>
  )
}
