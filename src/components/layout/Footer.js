import { Box, Container, Heading, Link, Text } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function MyFooter(props) {
  return (
    <Container marginTop='5em'>
      <Box>
        <Text>
          This app is a showcase for Louis "Delwiv" Cathala, the code is
          available at{' '}
          <Link
            href='https://github.com/delwiv/web3-portfolio'
            color='teal.500'
            isExternal
          >
            Github <ExternalLinkIcon mx='2px' />
          </Link>
        </Text>
      </Box>
    </Container>
  )
}
