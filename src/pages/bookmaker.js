import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react'

import { newContextComponents } from '@drizzle/react-components'
import AmountPicker from '../components/AmountPicker.js'
import { weiToEther } from '../utils/format.js'

const { ContractData, ContractForm } = newContextComponents

export default function Info(props) {
  const { Bookmaker } = props.drizzle.contracts
  const { drizzle, drizzleState } = props

  const [bets, setBets] = useState([])
  const [betValue, setBetValue] = useState(0)
  const [betDiff, setBetDiff] = useState(0)
  const [betName, setBetName] = useState('')
  const [betCount, setBetCount] = useState(0)

  const fetchBetCount = () =>
    Bookmaker.methods
      .getBetCount()
      .call()
      .then((count) => setBetCount(parseInt(count, 10)))

  const fetchBets = () =>
    Bookmaker.methods
      .getBetCount()
      .call()
      .then((count) =>
        Promise.all(
          new Array(parseInt(count, 10))
            .fill(1)
            .map((val, i) => Bookmaker.methods.bets(i).call())
        )
      )

  const createBet = async () => {
    console.log({ betValue, betDiff })
    const result = await Bookmaker.methods
      .createBet(`${betValue * 10 ** 18}`, `${betDiff}`, betName)
      .send()
    console.log({ result })
    fetchBets().then(setBets)
  }

  useEffect(() => {
    fetchBetCount()
  }, [])

  useEffect(() => {
    setBetName(
      `${betValue} $Eth that $Eth price goes ${betDiff} USD up or down`
    )
  }, [betDiff, betValue])
  return (
    <>
      <Container>
        <Heading size='xl'>Bet on $Eth price</Heading>
        <Box>
          <Heading size='sm'>Contract address: {Bookmaker.address}</Heading>
          <Heading>Create a new bet</Heading>
          <Heading size='md'>Choose bet amount</Heading>
          <AmountPicker
            value={betValue}
            onChange={setBetValue}
            myBalance={props.ethBalance}
            currency='$Eth'
          />
          <Heading size='md'>Choose Eth price diff</Heading>
          <AmountPicker
            value={betDiff}
            onChange={setBetDiff}
            myBalance={100 * 10 ** 18}
            step={1}
            currency='USD'
          />
          <Heading size='sm'>{betName}</Heading>
          <Button onClick={createBet}>Create bet</Button>
        </Box>
      </Container>
      <Grid templateColumns='repeat,(2, 1fr)'>
        {new Array(betCount).fill(true).map((b, i) => (
          <GridItem key={i}>
            <Box>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract='Bookmaker'
                method='bets'
                methodArgs={[`${i}`]}
                render={(data) => {
                  return (
                    <>
                      <Heading size='md'>Bet#{i}</Heading>
                      <Text>{data.name}</Text>
                      <Heading size='sm'>Amount to participate</Heading>
                      <Text>{weiToEther(data.amount)} $ETH</Text>
                      <Heading size='sm'>Details</Heading>
                      <Text>
                        $ETH price will go ${data.ethDiff} up or down ?
                      </Text>
                      <Flex>
                        <ContractForm
                          drizzle={drizzle}
                          drizzleState={drizzleState}
                          contract='Bookmaker'
                          method='subscribe'
                          methodArgs={[`${i}`, '1']}
                          render={({ handleSubmit }) => (
                            <Button onClick={handleSubmit}>UP</Button>
                          )}
                        />
                        <ContractForm
                          drizzle={drizzle}
                          drizzleState={drizzleState}
                          contract='Bookmaker'
                          method='subscribe'
                          methodArgs={[`${i}`, '2']}
                          render={({ handleSubmit }) => (
                            <Button onClick={handleSubmit}>DOWN</Button>
                          )}
                        />
                      </Flex>
                    </>
                  )
                }}
              />
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract='Bookmaker'
                method='bets'
                methodArgs={[`${i}`]}
              />
            </Box>
          </GridItem>
        ))}
      </Grid>
    </>
  )
}
