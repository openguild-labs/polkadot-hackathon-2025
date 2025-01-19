export const PublicSocketEvent = {
    SPOT_RECENT_TRADE_ADD: 'spot:recent_trade:add',
    SPOT_DEPTH_UPDATE: 'spot:depth:update',
    SPOT_TICKER_UPDATE: 'spot:ticker:update',

    FUTURES_DEPTH_UPDATE: 'futures:depth:update',
    FUTURES_TICKER_UPDATE: 'futures:ticker:update',
    FUTURES_MINI_TICKER_UPDATE: 'futures:mini_ticker:update',
    FUTURES_MARK_PRICE_UPDATE: 'futures:mark_price:update',

    IEO_PERCENTAGE_UPDATE: 'ieo:project_update',
    IEO_TICKET_STATUS_UPDATE: 'ieo:buy_response',
    CALCULATE_WITHDRAW_FEE: 'calculate_withdrawal_fee',

    // tv chart
    FUTURE_SUBSCRIBE_TICKER: 'subscribe:futures:ticker',
    FUTURE_UNSUBSCRIBE_TICKER: 'unsubscribe:futures:ticker',
};

export const UserSocketEvent = {
    CHANGE_STATE_INSURANCE: 'CHANGE_STATE_INSURANCE',
    BUY_INSURANCE_SUCCESS: 'BUY_INSURANCE_SUCCESS',
    CHANGE_DATA_LANDING_PAGE: 'CHANGE_DATA_LANDING_PAGE',
    FUNDING_RATE: 'FUNDING_RATE',
    MARKET: 'MARKET',
    HISTORY_ONCHAIN: 'HISTORY_ONCHAIN',
    UPDATE_WALLET_OFFCHAIN: 'nami:update:wallet',
    UPDATE_USER_OFFCHAIN: 'nami:update:user',
    SYSTEM_MAINTAINED: 'SYSTEM_MAINTAINED',
};
