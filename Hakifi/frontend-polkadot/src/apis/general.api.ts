import request from './request/instance'
import {
  API_GET_STATS,
  API_GET_TRANSACTIONS,
  API_GET_CONTRACT_STATS,
  API_GET_MARKET_OVERVIEW,
} from './urls'

export const getStats = async () => {
  return await request.get(API_GET_STATS)
}

export const getTransactions = async () => {
  return await request.get(API_GET_TRANSACTIONS)
}

export const getSmartContractStats = async () => {
  return await request.get(API_GET_CONTRACT_STATS)
}

export const getMarketOverview = async () => {
  return await request.get(API_GET_MARKET_OVERVIEW)
}

export const getFaucet = async () => {
  return await request.get('/wallets/faucet')
}
