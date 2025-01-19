export const SIDE = {
    Bear: 'Bear',
    Short: 'Short',
    Bull: 'Bull',
    Long: 'Long',
};

export const HAKIFI_KEY = {
    SYMBOL: "HAKIFI_KEY_SYMBOL",
};

export enum MODE {
    BULL = "BULL",
    BEAR = "BEAR",
}

export const HEDGE_INIT = 0.05;

export const MARGIN_PERCENT = {
    0.02: '2%',
    0.04: '4%',
    0.06: '6%',
    0.08: '8%',
    0.1: '10%',
} as Record<number, string>;

export enum NOTIFICATIONS {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
}

export enum TRADING_VIEW_DEFAULTS {
    LIBRARY_PATH = "/lib/tradingview/charting_library/",
    CHARTS_STORAGE_URL = "https://saveload.tradingview.com",
    CHARTS_STORAGE_API_VERSION = "1.1",
    CLIENT_ID = "tradingview.com",
    USER_ID = "public_user_id",
    CONTAINER_ID_SPOT = "tv_chart_container",
    CONTAINER_ID_SPOT_DETAIL = "tv_chart_container_detail",
    INTERVAL = "1D",
    CUSTOM_CSS = "/lib/tradingview/trading_view.theme.css",
    TEST_SYMBOL = "Bitfinex:BTC/USD",
    PRESET_WIDTH = 1023,
}

export const STATE_INSURANCES: { [key: string]: string; } = {
    CLAIM_WAITING: "Claim-waiting",
    REFUNDED: "Refunded",
    CLAIMED: "Claimed",
    EXPIRED: "Expired",
    LIQUIDATED: "Liquidated",
    AVAILABLE: "Available",
    CANCELLED: "Cancelled",
    INVALID: "Invalid",
    REFUND_WAITING: "Refund-waiting",
    PENDING: "Pending",
};

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    AVAILABLE: 'AVAILABLE',
    EXPIRED: 'EXPIRED',
    REFUNDED: 'REFUNDED',
    REFUND_WAITING: 'REFUND_WAITING',
    CLAIMED: 'CLAIMED',
    CLAIM_WAITING: 'CLAIM_WAITING',
    LIQUIDATED: 'LIQUIDATED',
    INVALID: 'INVALID',
    CANCELLED: 'CANCELLED'
};

export const ORDER_LIST_MODE = {
    OPENING: "opening",
    HISTORY: "history",
};

export const GLOSSARY_MODE = {
    TERMINOLOGY: "terminology",
    STATUS: "status",
};

export const STATUS_DEFINITIONS: Record<string, {
    title: string;
    variant: "primary" | "error" | "warning" | "disabled" | "success";
    description: string;
}> = {
    PENDING: {
        title: "Pending",
        variant: "warning",
        description: "Contract is pending for signing and confirmation"
    },
    AVAILABLE: {
        title: "Available",
        variant: "primary",
        description: "Contract is active and has not yet reached any other status"
    },
    CLAIM_WAITING: {
        title: "Claim-waiting",
        variant: "warning",
        description: "Market price reached Claimed price, awaiting insurance payment"
    },
    CLAIMED: {
        title: "Claimed",
        variant: "success",
        description: "Insurance payment has been transferred"
    },
    REFUND_WAITING: {
        title: "Refund-waiting",
        variant: "warning",
        description: "Market price reached refund condition at contract expiration, awaiting margin refund"
    },
    REFUNDED: {
        title: "Refunded",
        variant: "success",
        description: "Margin refund has been transferred"
    },
    CANCELLED: {
        title: "Cancelled",
        variant: "disabled",
        description: "Contract was canceled before expiration, margin refund has been transferred"
    },

    LIQUIDATED: {
        title: "Liquidated",
        variant: "error",
        description: "Market price reached Liquid. price, margin has been liquidated"
    },
    EXPIRED: {
        title: "Expired",
        variant: "error",
        description: "Market price reached liquidation condition at contract expiration, margin has been liquidated"
    },
    INVALID: {
        title: "Invalid",
        variant: "disabled",
        description: "Open price exceeded 0.3% compared to Market price at contract opening confirmation"
    },
};
export const CHAIN_SCAN = process.env.NEXT_PUBLIC_CHAIN_SCAN;
