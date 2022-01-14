import Contract from 'web3-eth-contract'
import { formatEther } from '@ethersproject/units'
import { InjectedConnector } from '@web3-react/injected-connector'

import { setBadChainId, setLoading } from './app.js'
import tokenInterface from '../../contracts/RocketifyToken.json'

export const CHAIN_ID = 4

const injected = new InjectedConnector({ supportedChainIds: [CHAIN_ID] })
const erc20Token = process.env.NEXT_PUBLIC_TOKEN_ADDRESS

export const setState = (key, data) => ({ type: 'SET_STATE', data, key })

export const loadTokenContract = () => async (dispatch, getState) => {
  const context = getState().web3.context
  Contract.setProvider(context.library.provider)

  const RocketifyToken = await new Contract(tokenInterface.abi, erc20Token)
  dispatch(setState('tokenContract', RocketifyToken))
}

export const connectWeb3 = () => async (dispatch, getState) => {
  dispatch(setLoading(true))
  console.log({ state: getState() })
  await getState().web3.context.activate(injected)
  dispatch(setLoading(false))
}

export const changeChainId = () => async (dispatch, getState) => {
  const provider = await getState().web3.context.connector.getProvider()
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${CHAIN_ID}` }],
  })
  dispatch(setBadChainId(false))
}

export const loadContractData = () => async (dispatch, getState) => {
  dispatch(setLoading(true))
  const { web3 } = getState()
  const {
    context: { library, account },
    tokenContract,
  } = web3
  const ethBalance = await library.getBalance(account)
  const totalSupply = await tokenContract.methods.totalSupply().call()
  const rockets = await tokenContract.methods.balanceOf(account).call()
  dispatch(setState('eth', { balance: formatEther(ethBalance) }))
  dispatch(
    setState('rocket', {
      ...getState().web3.rocket,
      balance: rockets,
      totalSupply,
    })
  )
  dispatch(setState('dataLoaded', true))
  dispatch(setLoading(false))
}

export const setAddressCount = (addressCount) => ({
  type: 'SET_ADDRESS_COUNT',
  addressCount,
})

export const setAddress = ({ address, ...payload }) => ({
  type: 'SET_ADDRESS',
  address,
  payload,
})

export const setAddresses = (addresses) => ({
  type: 'SET_ADDRESSES',
  addresses,
})

export const fetchAllNames = () => async (dispatch, getState) => {
  const { tokenContract, rocket } = getState().web3
  await Promise.all(
    rocket.addressesRaw.map((address) =>
      tokenContract.methods
        .userNames(address)
        .call()
        .then((name) => dispatch(setAddress({ address, name })))
    )
  )
}

export const fetchAllBurns = () => async (dispatch, getState) => {
  const { tokenContract, rocket } = getState().web3
  await Promise.all(
    rocket.addressesRaw.map((address) =>
      tokenContract.methods
        .getBurnByAddress(address)
        .call()
        .then((burnt) => dispatch(setAddress({ address, burnt })))
    )
  )
}

export const fetchAllBalances = () => async (dispatch, getState) => {
  const { tokenContract, rocket } = getState().web3
  await Promise.all(
    rocket.addressesRaw.map((address) =>
      tokenContract.methods
        .balanceOf(address)
        .call()
        .then((balance) => dispatch(setAddress({ address, balance })))
    )
  )
}

export const getAddresses = () => async (dispatch, getState) => {
  dispatch(setLoading(true))
  const { tokenContract, rocket } = getState().web3
  const addresses = await Promise.all(
    new Array(rocket.addressCount)
      .fill(1)
      .map((_, i) => tokenContract.methods.getAddressByIndex(i).call())
  )
  if (addresses.length !== rocket.addressesRaw.length) {
    dispatch(setAddresses(addresses))
  }
  dispatch(setLoading(false))
  dispatch(fetchAllBalances())
  dispatch(fetchAllBurns())
  dispatch(fetchAllNames())
}

export const getAddressCount = () => async (dispatch, getState) => {
  dispatch(setLoading(true))
  const { tokenContract } = getState().web3
  const addressCount = Number(
    await tokenContract.methods.getAddressCount().call()
  )

  dispatch(setAddressCount(addressCount))
  dispatch(setLoading(false))
  dispatch(getAddresses())
}

export const fetchTotalBurn = () => async (dispatch, getState) => {
  dispatch(setLoading(true))
  const { tokenContract, rocket } = getState().web3
  const totalBurnt = await tokenContract.methods.burnedAmount().call()

  dispatch(setState('rocket', { ...rocket, totalBurnt }))
}

export const loadTokenData = () => async (dispatch, getState) => {
  dispatch(setLoading(true))

  dispatch(getAddressCount())
  dispatch(fetchTotalBurn())

  dispatch(setLoading(false))
}

export const reloadData = () => async (dispatch, getState) => {
  dispatch(loadContractData())
  dispatch(loadTokenData())
}
