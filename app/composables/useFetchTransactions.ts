export const useFetchTransactions = async (period: Ref) => {
  const supabase = useSupabaseClient();

  const {
    data: transactions,
    refresh,
    pending,
  } = await useAsyncData(
    `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
    async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select()
        .gte('created_at', period.value.from.toISOString())
        .lte('created_at', period.value.to.toISOString())
        .order('created_at', { ascending: false });

      if (error) return [];

      return data;
    },
  );

  const income = computed(() => transactions.value?.filter(t => t.type === 'Income'));
  const expense = computed(() => transactions.value?.filter(t => t.type === 'Expense'));

  const incomeCount = computed(() => income.value?.length);
  const expenseCount = computed(() => expense.value?.length);

  const incomeTotal = computed(() =>
    income.value?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0),
  );
  const expenseTotal = computed(() =>
    expense.value?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0),
  );

  watch(period, async () => await refresh());

  const transactionsGroupedByDate = computed(() => {
    if (!transactions.value) return {};
    return transactions.value.reduce((grouped: { [key: string]: any }, transaction) => {
      const date = transaction.created_at.split('T')[0];
      if (!grouped[date!]) {
        grouped[date!] = [];
      }
      grouped[date!].push(transaction);
      return grouped;
    }, {});
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      incomeCount,
      expenseCount,
      incomeTotal,
      expenseTotal,
    },
    pending,
    refresh,
  };
};
