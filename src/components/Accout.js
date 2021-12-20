import React, { useState, useEffect } from 'react'
import { newContextComponents } from '@drizzle/react-components'

import { weiToEther } from '../utils/format.js'

const { AccountData, ContractData } = newContextComponents

export default ({ drizzle, drizzleState }) => {
  const address = drizzleState.accounts[0]
  const [ethBalance, setEthBalance] = useState(0)

  const fetchEthBalance = () => drizzle.web3.eth.getBalance(address)
  useEffect(() => {
    fetchEthBalance().then(setEthBalance)
  }, [])
  return (
    <div className='account'>
      <h2>Account</h2>
      {address}
      <div>{weiToEther(ethBalance).toFixed(10)} $ETHEREUM</div>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract='RocketifyToken'
        method='getMyBalance'
        render={data => ` ${weiToEther(data)} $ROCKET`}
      />
      <h3>Burnt</h3>
      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract='RocketifyToken'
        method='burnByAddress'
        methodArgs={[address]}
        render={data => ` ${weiToEther(data)} $ROCKET`}
      />
    </div>
  )
}
