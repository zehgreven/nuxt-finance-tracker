export const useFetchTransactions = async () => {
  const supabase = useSupabaseClient();

  const pending = ref(false);

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

  const { data: transactions, refresh } = await useAsyncData('transactions', async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return [];
    }
    return data;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      incomes,
      expenses,
      incomeCount,
      expenseCount,
      incomeTotal,
      expenseTotal,
    },
    pending,
    refresh,
  };
};
