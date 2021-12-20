import React, { useState, useEffect } from 'react'
import { newContextComponents } from '@drizzle/react-components'

import { weiToEther, shortAddress } from '../utils/format.js'

const { ContractData } = newContextComponents

export default ({ drizzle, drizzleState, setError }) => {
  const { RocketifyToken } = drizzle.contracts
  const [allAddresses, setAllAddresses] = useState([])
  const [addressCount, setAddressCount] = useState(0)

  const fetchAllAddresses = async () => {
    try {
      const addressCount = Number(await RocketifyToken.methods.getAddressCount().call())
      const addresses = await Promise.all(new Array(addressCount).fill(1).map((_, i) => RocketifyToken.methods.getAddressByIndex(i).call()))
      setAllAddresses(addresses)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchAllAddresses()
  }, [])

  return (
    <div className='allBalances'>
      <h2>All accounts</h2>
      <h3>Address count</h3>
      {allAddresses.length} addresses registered

      <h3>Balances</h3>
      {allAddresses.map(address => (
        <div key={address} className='addressList'>
          <span className='address'>{address}</span>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract='RocketifyToken'
            method='balanceOf'
            methodArgs={[address]}
            render={data => `  ${weiToEther(data)} $ROCKET`}
          />
        </div>
      ))}
      <h3>Burnt</h3>
      <p>Total :
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract='RocketifyToken'
          method='burnedAmount'
          render={data => `  ${data / 10 ** 18} $ROCKET`}
        />
      </p>
      {allAddresses.map(address => (
        <div key={address} className='addressList'>
          <span className='address'>{address}</span>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract='RocketifyToken'
            method='getBurnByAddress'
            methodArgs={[address]}
            render={data => `  ${weiToEther(data)} $ROCKET`}
          />
        </div>
      ))}
    </div>
  )
}
