import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import * as process from "process";
import {LatestTransaction, Transaction, TransactionData, TransactionList, TransactionListWithChainID} from "./dto";

@Injectable()
export class HistoryService {

  constructor(
      private readonly httpService: HttpService,
  ) {
  }

  // async getLastHistoryEvents(address: string): Promise<TransactionData | null> {
  //   try {
  //     const chains = [1, 56, 137, 100, 250, 10, 42161, 43114];
  //     const promises = chains.map(async (chainID) => {
  //       const data = await this.httpService.axiosRef.get<TransactionList>(`${process.env.transaction_history_url}/${chainID}/${address}?limit=1000`)
  //       const txs = data.data.items;
  //       return {items: txs, chainID: chainID} as TransactionListWithChainID;
  //     });
  //     const data = await Promise.all(promises);
  //
  //     const latestOutboundTransaction = findLatestOutboundTransaction(data);
  //     const totalTransactionHappenedOverLast7DaysTotal = calculateTotalTransactionsLast7Days(data);
  //     const totalTransactionsLast7DaysFromOwner = calculateTotalTransactionsLast7DaysFromOwner(data);
  //     const chainIDsWithActivity = findChainIDsWithTransactions(data);
  //     const hasNotDumbTransaction = hasAuthorizeTransaction(data);
  //     return {
  //       latestOutboundTransactionDate: latestOutboundTransaction ? new Date(latestOutboundTransaction.mined_at * 1000) : null,
  //       totalTransactionHappenedOverLast7DaysTotal,
  //       totalTransactionsLast7DaysFromOwner,
  //       chainIDsWithActivity,
  //       hasNotDumbTransaction,
  //     }
  //   } catch (error) {
  //     console.error('HISTORY',error)
  //     return null;
  //   }
  //
  // }

  async getLastHistoryEvents(address: string): Promise<TransactionData | null> {
    try {
      const chains = [1, 56, 137, 100, 250, 10, 42161, 43114];
      const limit = 5000;
      let data: TransactionListWithChainID[] = [];
      let totaTxsCounter = 0;
      let oldEnough = false;

      for (const chainID of chains) {
        let oldestBlockNumber: number | undefined;
        const txs: Transaction[] = [];

        while (true) {
          const response = await this.getChainTransactions(address, chainID, limit, oldestBlockNumber);
          const currentTxs = response.items;
          txs.push(...currentTxs);

          if (currentTxs.length === 0 || response.oldestBlockNumber === undefined) {
            break;
          }
          totaTxsCounter += currentTxs.length;

          if (totaTxsCounter > 20_000) {
            oldEnough = true;
            break;
          }

          // console.log(`Fetched ${currentTxs.length} transactions for chain ${chainID}`)
          // console.log(`Total ${txs.length} transactions for chain ${chainID}`)

          oldestBlockNumber = response.oldestBlockNumber;
        }

        data.push({ items: txs, chainID: chainID } as TransactionListWithChainID);
      }

      const latestOutboundTransaction = findLatestOutboundTransaction(data);
      const totalTransactionHappenedOverLast7DaysTotal = calculateTotalTransactionsLast7Days(data);
      const totalTransactionsLast7DaysFromOwner = calculateTotalTransactionsLast7DaysFromOwner(data);
      const chainIDsWithActivity = findChainIDsWithTransactions(data);
      const hasNotDumbTransaction = hasAuthorizeTransaction(data);
      const earliestTransaction = findEarliestTransaction(data);
      const totalTxs = calculateTotalTransactions(data)

      return {
        latestOutboundTransactionDate: latestOutboundTransaction ? new Date(latestOutboundTransaction.mined_at * 1000) : null,
        totalTransactionHappenedOverLast7DaysTotal,
        totalTransactionsLast7DaysFromOwner,
        chainIDsWithActivity,
        hasNotDumbTransaction,
        earliestTransaction,
        totalTxs,
        oldEnough
      };
    } catch (error) {
      console.error('HISTORY', error);
      return null;
    }
  }

  async getChainTransactions(
      address: string,
      chainID: number,
      limit: number,
      from?: number
  ): Promise<any> {
    const response = await this.httpService.axiosRef.get<TransactionList>(
        `${process.env.transaction_history_url}/${chainID}/${address}?limit=${limit}${from ? `&from=${from}` : ''}`
    );

    const txs = response.data.items;
    const oldestBlockNumber = txs.length > 0 ? txs[txs.length - 1].block_number : undefined;
    return { items: txs, chainID: chainID, oldestBlockNumber: oldestBlockNumber };
  }

}

function findLatestOutboundTransaction(transactions: TransactionListWithChainID[]): LatestTransaction | null {
  let latestInboundTransaction: LatestTransaction | null = null;
  let latestTimestamp = 0;

  for (const transactionList of transactions) {
    for (const transaction of transactionList.items) {
      if (transaction.direction === "out" && transaction.mined_at > latestTimestamp) {
        latestInboundTransaction = {...transaction, chainID:transactionList.chainID } as LatestTransaction;
        latestTimestamp = transaction.mined_at;
      }
    }
  }

  return latestInboundTransaction;
}

function calculateTotalTransactionsLast7Days(transactions: TransactionListWithChainID[]): number {
  const currentTime = Math.floor(Date.now() / 1000); // Convert current time to Unix timestamp
  const sevenDaysAgo = currentTime - 7 * 24 * 60 * 60; // Calculate Unix timestamp for 7 days ago

  let totalTransactions = 0;

  for (const transactionList of transactions) {
    for (const transaction of transactionList.items) {
      if (transaction.mined_at >= sevenDaysAgo && transaction.mined_at <= currentTime) {
        totalTransactions++;
      }
    }
  }

  return totalTransactions;
}

function calculateTotalTransactionsLast7DaysFromOwner(transactions: TransactionListWithChainID[]): number {
  const currentTime = Math.floor(Date.now() / 1000); // Convert current time to Unix timestamp
  const sevenDaysAgo = currentTime - 7 * 24 * 60 * 60; // Calculate Unix timestamp for 7 days ago

  let totalOutTransactions = 0;

  for (const transactionList of transactions) {
    for (const transaction of transactionList.items) {
      if (
          transaction.direction === "out" &&
          transaction.mined_at >= sevenDaysAgo &&
          transaction.mined_at <= currentTime
      ) {
        totalOutTransactions++;
      }
    }
  }

  return totalOutTransactions;
}

function findChainIDsWithTransactions(transactions: TransactionListWithChainID[]): number[] {
  const chainIDsWithTransactions: number[] = [];

  for (const transactionList of transactions) {
    if (transactionList.items.length > 0) {
      chainIDsWithTransactions.push(transactionList.chainID);
    }
  }

  return chainIDsWithTransactions;
}
function hasAuthorizeTransaction(transactions: TransactionList[]): boolean {
  for (const transactionList of transactions) {
    for (const transaction of transactionList.items) {
      if (transaction.type !== "send" && transaction.type !== "receive" && transaction.type !== "execution" && transaction.direction === "out") {
        return true;
      }
    }
  }

  return false;
}

interface ChainTransactionData {
  chainID: number;
  date: Date;
}

function findEarliestTransaction(transactions: TransactionListWithChainID[]): ChainTransactionData | null {
  let earliestTransaction: Transaction | null = null;
  let earliestChainID: number | null = null;

  for (const chain of transactions) {
    for (const transaction of chain.items) {
      if (!earliestTransaction || transaction.mined_at < earliestTransaction.mined_at) {
        earliestTransaction = transaction;
        earliestChainID = chain.chainID;
      }
    }
  }

  if (earliestTransaction && earliestChainID !== null) {
    return { chainID: earliestChainID, date: new Date(earliestTransaction.mined_at * 1000) };
  }

  return null;
}

function calculateTotalTransactions(transactions: TransactionListWithChainID[]): number {
  let totalTransactions = 0;

  for (const chain of transactions) {
    totalTransactions += chain.items.length;
  }

  return totalTransactions;
}