export const useCurrency = (
  amount: number | Ref<number>,
  locale: string = 'pt-BR',
  currency: string = 'BRL',
): { currency: ComputedRef<string> } => {
  const amountValue = isRef(amount) ? amount.value : amount;
  const result = computed(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amountValue);
  });

  return {
    currency: result,
  };
};
