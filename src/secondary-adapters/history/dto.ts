export interface Transaction {
    hash: string;
    mined_at: number;
    direction: 'in' | 'out';
    nonce: number;
    block_number: number;
    fee: string;
    fee_price: number | null;
    type: 'execution' | string; // You can add other possible types here
    address_from: string;
    address_to: string;
    status: 'confirmed' | string; // You can add other possible status values here
    native_price: number;
    changes: any[]; // You can replace 'any' with the specific type if you know the structure of the 'changes' array
}

export interface LatestTransaction extends Transaction {
 chainID: number;
}

export interface TransactionList {
    items: Transaction[];
}

export interface TransactionListWithChainID extends TransactionList {
    chainID: number;
}

export interface TransactionData {
    latestOutboundTransactionDate: Date | null;
    totalTransactionHappenedOverLast7DaysTotal: number;
    totalTransactionsLast7DaysFromOwner: number;
    chainIDsWithActivity: number[];
    hasNotDumbTransaction: boolean;
}
