<template>
  <div>
    <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <USelectMenu
        v-model="viewSelected"
        :items="transactionViewOptions"
        class="w-48"
        button-class="bg-white border border-gray-300 text-gray-700"
      />
    </section>

    <section class="flex justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-gray-500 dark:text-gray-400">
          You have {{ incomeCount }} income and {{ expenseCount }} expenses this period.
        </div>
      </div>
      <div>
        <TransactionModal v-model="isModalOpen" @saved="refresh" />
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
      <Trend
        title="Income"
        color="green"
        :amount="incomeTotal"
        :last-amount="3000"
        :loading="pending"
      />
      <Trend
        title="Expenses"
        color="red"
        :amount="expenseTotal"
        :last-amount="1500"
        :loading="pending"
      />
      <Trend
        title="Savings"
        color="green"
        :amount="incomeTotal - expenseTotal"
        :last-amount="3000"
        :loading="pending"
      />
      <Trend
        title="Investments"
        color="red"
        :amount="3500"
        :last-amount="4000"
        :loading="pending"
      />
    </section>

    <section v-if="!pending">
      <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">
        <DailyTransactionSummary :transactions="transactionsOnDay" :date="date" />

        <Transaction
          v-for="transaction in transactionsOnDay"
          :key="transaction.id"
          :transaction="transaction"
          @deleted="refresh"
        />
      </div>
    </section>
    <div v-else>
      <USkeleton v-for="n in 4" :key="n" class="h-8 w-full mb-2" />
    </div>
  </div>
</template>

<script setup>
import { transactionViewOptions } from '~/constants.ts';

const viewSelected = ref(transactionViewOptions[1]);
const isModalOpen = ref(false);

const {
  pending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { byDate },
  },
} = await useFetchTransactions();
</script>
