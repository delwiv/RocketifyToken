const initialState = {
  loading: false,
  badChainId: false,
  error: '',
  message: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.error,
      }
    }
    case 'SET_MESSAGE': {
      return {
        ...state,
        message: action.message,
      }
    }
    case 'SET_BADCHAINID': {
      return {
        ...state,
        badChainId: action.data,
      }
    }
    case 'SET_LOADING': {
      return {
        ...state,
        loading: action.data,
      }
    }
    default:
      return state
  }
}
