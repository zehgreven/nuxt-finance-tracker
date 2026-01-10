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
        <UButton icon="i-heroicons-plus-circle" color="neutral" variant="outline" label="Add" />
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
      <Trend title="Income" :amount="incomeTotal" :last-amount="3000" :loading="isLoading" />
      <Trend title="Expenses" :amount="expenseTotal" :last-amount="1500" :loading="isLoading" />
      <Trend
        title="Savings"
        :amount="incomeTotal - expenseTotal"
        :last-amount="3000"
        :loading="isLoading"
      />
      <Trend title="Investments" :amount="3500" :last-amount="4000" :loading="isLoading" />
    </section>

    <section v-if="!isLoading">
      <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-10">
        <DailyTransactionSummary :transactions="transactionsOnDay" :date="date" />

        <Transaction
          v-for="transaction in transactionsOnDay"
          :key="transaction.id"
          :transaction="transaction"
          @deleted="refreshTransactions"
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
const isLoading = ref(false);
const supabase = useSupabaseClient();
const transactions = ref([]);

const incomes = computed(() => {
  return transactions.value
    ? transactions.value.filter(t => t.type.toLowerCase() === 'income')
    : [];
});

const expenses = computed(() => {
  return transactions.value
    ? transactions.value.filter(t => t.type.toLowerCase() === 'expense')
    : [];
});

const incomeCount = computed(() => incomes.value.length);
const expenseCount = computed(() => expenses.value.length);

const incomeTotal = computed(() => {
  return incomes.value.reduce((sum, t) => sum + t.amount, 0);
});
const expenseTotal = computed(() => {
  return expenses.value.reduce((sum, t) => sum + t.amount, 0);
});

const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase.from('transactions').select('*');

    if (error) {
      return [];
    }

    return data;
  } finally {
    isLoading.value = false;
  }
};

const refreshTransactions = async () => {
  transactions.value = await fetchTransactions();
};

await refreshTransactions();

const transactionsGroupedByDate = computed(() => {
  if (!transactions.value) return {};
  return transactions.value.reduce((groups, transaction) => {
    const date = new Date(transaction.created_at).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
});
</script>
