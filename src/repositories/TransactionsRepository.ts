import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = this.find();

    const totalIncome = (await transactionsRepository).reduce(
      (total, currentIncome) =>
        currentIncome.type === 'income'
          ? total + Number(currentIncome.value)
          : total,
      0,
    );

    const totalOutcome = (await transactionsRepository).reduce(
      (total, currentOutcome) =>
        currentOutcome.type === 'outcome'
          ? total + Number(currentOutcome.value)
          : total,
      0,
    );

    const total = totalIncome - totalOutcome;
    return {
      income: totalIncome,
      outcome: totalOutcome,
      total,
    };
  }
}

export default TransactionsRepository;
