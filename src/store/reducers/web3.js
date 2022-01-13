const initialState = {
  dataLoaded: false,
  account: null,
  tokenContract: null,
  transactions: {
    current: null,
    history: [],
  },
  eth: {
    balance: 0,
  },
  rocket: {
    balance: 0,
    burnt: 0,
    totalSupply: 0,
    addressCount: 0,
    addresses: {},
    addressesRaw: [],
    accounts: [],
  },
  context: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return {
        ...state,
        rocket: {
          ...state.rocket,
          addresses: {
            ...state.rocket.addresses,
            [action.address]: {
              ...state.rocket.addresses[action.address],
              ...action.payload,
            },
          },
        },
      }
    case 'SET_ADDRESS_COUNT':
      return {
        ...state,
        rocket: {
          ...state.rocket,
          addressCount: action.addressCount,
        },
      }

    case 'SET_ADDRESSES':
      return {
        ...state,
        rocket: {
          ...state.rocket,
          addressesRaw: action.addresses,
          addresses: action.addresses.reduce((acc, cur) => {
            acc[cur] = { balance: 0, burnt: 0, name: '' }
            return acc
          }, {}),
        },
      }
    case 'SET_STATE': {
      return {
        ...state,
        [action.key]: action.data,
      }
    }
    default:
      return state
  }
}
