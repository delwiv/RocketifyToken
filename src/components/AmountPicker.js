import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Link,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'

import { weiToEther } from '../utils/format.js'

export default function AmountPicker({ onChange, value, myBalance }) {
  return (
    <>
      <Slider
        marginTop={45}
        onChange={(val) => onChange(val)}
        defaultValue={0}
        min={0}
        max={weiToEther(myBalance)}
      >
        <SliderMark value={0} mt='1' ml='-2.5' fontSize='sm'>
          0
        </SliderMark>
        <SliderMark
          value={weiToEther(myBalance) / 2}
          mt='1'
          ml='-2.5'
          fontSize='sm'
        >
          {weiToEther(myBalance) / 2}
        </SliderMark>
        <SliderMark
          value={weiToEther(myBalance)}
          mt='1'
          ml='-2.5'
          fontSize='sm'
        >
          {weiToEther(myBalance)}
        </SliderMark>
        <SliderMark
          value={value}
          textAlign='center'
          bg='red.500'
          color='white'
          zIndex={100}
          marginTop={-45}
        >
          {value} $ROCKET
        </SliderMark>
        <SliderTrack bg='red.100'>
          <Box position='relative' right={10} />
          <SliderFilledTrack bg='tomato' />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
      <Input onChange={(e) => onChange(e.target.value)} value={value} />
    </>
  )
}
