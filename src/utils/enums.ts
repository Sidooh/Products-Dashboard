export enum Product {
    AIRTIME = 'AIRTIME',
    SUBSCRIPTION = 'SUBSCRIPTION',
    VOUCHER = 'VOUCHER',
    WITHDRAWAL = 'WITHDRAWAL',
    UTILITY = 'UTILITY',
    MERCHANT = 'MERCHANT',
    FLOAT = 'FLOAT',
}

export enum CacheKey {
    TOTAL_TRANSACTIONS_COUNT = 'total_transactions_count,total_transactions_count_today',
    TOTAL_REVENUE_AMOUNT = 'total_revenue_amount,total_revenue_amount_today',

    TANDA_FLOAT_BALANCE = 'tanda_float_balance',
    KYANDA_FLOAT_BALANCE = 'kyanda_float_balance',
    AT_AIRTIME_BALANCE = 'at_airtime_balance'
}