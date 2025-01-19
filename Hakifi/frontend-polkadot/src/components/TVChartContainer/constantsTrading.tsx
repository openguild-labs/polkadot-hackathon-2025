export const mainIndicators = [
    {
        value: 'Moving Average',
        label: 'MA',
    },
    {
        value: 'Moving Average Exponential',
        label: 'EMA',
    },
    {
        value: 'Bollinger Bands',
        label: 'BOLL',
    },
]
export const subIndicators = [
    {
        value: 'Volume',
        label: 'VOL',
    },
    {
        value: 'MACD',
        label: 'MACD',
    },
    {
        value: 'Relative Strength Index',
        label: 'RSI',
    },
    // 'KDJ'
]

export const ChartStatus = {
    NOT_LOADED: 1,
    LOADED: 2,
    RECONNECTING: 3,
    UNABLE_TO_CONNECT: 4,
}

export const CHART_VERSION = '1.0'

export const ChartMode = {
    SPOT: 'SPOT',
    FUTURES: 'FUTURES',
}

export const ChartBroker = {
    NAMI_FUTURE: 'NamiFuture',
}
export const TradingViewSupportTimezone = [
    { timezone: 'Pacific/Honolulu', offset: -600 },
    { timezone: 'America/Juneau', offset: -480 },
    { timezone: 'America/Phoenix', offset: -420 },
    { timezone: 'America/El_Salvador', offset: -360 },
    { timezone: 'America/Chicago', offset: -300 },
    { timezone: 'America/Caracas', offset: -270 },
    { timezone: 'America/New_York', offset: -240 },
    { timezone: 'America/Sao_Paulo', offset: -180 },
    { timezone: 'Etc/UTC', offset: 0 },
    { timezone: 'Europe/London', offset: 60 },
    { timezone: 'Europe/Paris', offset: 120 },
    { timezone: 'Europe/Athens', offset: 180 },
    { timezone: 'Europe/Moscow', offset: 240 },
    { timezone: 'Asia/Tehran', offset: 270 },
    { timezone: 'Asia/Ashkhabad', offset: 300 },
    { timezone: 'Asia/Kolkata', offset: 330 },
    { timezone: 'Asia/Kathmandu', offset: 345 },
    { timezone: 'Asia/Almaty', offset: 360 },
    { timezone: 'Asia/Bangkok', offset: 420 },
    { timezone: 'Asia/Singapore', offset: 480 },
    { timezone: 'Asia/Tokyo', offset: 540 },
    { timezone: 'Australia/Adelaide', offset: 570 },
    { timezone: 'Australia/Brisbane', offset: 600 },
    { timezone: 'Pacific/Norfolk', offset: 690 },
    { timezone: 'Pacific/Auckland', offset: 720 },
    { timezone: 'Pacific/Chatham', offset: 765 },
    { timezone: 'Pacific/Fakaofo', offset: 780 },
]

export const getInterval = (resolution: string): string => {
    if (resolution.includes('D') || resolution.includes('W') || resolution.includes('M')) {
        return '1d'
    }
    if (+resolution >= 60) {
        return '1h'
    }
    return '1m'
}

export const listTimeFrameOrginal = [
    {
        vi: '3D',
        en: '3D',
        resolution: '3D',
    },
    {
        vi: '1W',
        en: '1W',
        resolution: '1W',
    },
    {
        vi: '1M',
        en: '1M',
        resolution: '1M',
    },
    // {
    //     vi: 'Tất cả',
    //     en: 'All',
    //     value: 'All',
    // },
]

export const listTimeFrame = [
    {
        label: '5m',
        resolution: '5',
    },
    {
        label: '15m',
        resolution: '15',
    },
    {
        label: '1h',
        resolution: '60',
    },
    {
        label: '4h',
        resolution: '240',
    },
    {
        label: '1D',
        resolution: '1D',
    },
    {
        label: '1W',
        resolution: '1W',
    },
    {
        label: '1M',
        resolution: '1M',
    },
]

export const chartTypes = {
    Bar: 0,
    Candle: 1,
    Line: 2,
    Area: 3,
}
