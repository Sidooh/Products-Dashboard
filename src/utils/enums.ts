export enum Telco {
    SAFARICOM = 'SAFARICOM',
    AIRTEL = 'AIRTEL',
    TELKOM = 'TELKOM',
    EQUITEL = 'EQUITEL',
    FAIBA = 'FAIBA',
}

export enum Status {
    //success
    COMPLETED = 'COMPLETED',
    ACTIVE = 'ACTIVE',

    //info
    PENDING = 'PENDING',

    //warning
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',

    //grey
    REFUNDED = 'REFUNDED',

    //red
    FAILED = 'FAILED',
}

export enum PaymentType {
    MPESA = 'MPESA',
    SIDOOH = 'SIDOOH',
}