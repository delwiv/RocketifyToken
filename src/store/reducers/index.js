import { combineReducers } from 'redux'

import web3 from './web3.js'
import app from './app.js'

export default combineReducers({ web3, app })
