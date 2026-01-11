export const useCurrency = (
  amount: number | Ref<number>,
  locale: string = 'pt-BR',
  currency: string = 'BRL',
): { currency: ComputedRef<string> } => {
  const result = computed(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(isRef(amount) ? amount.value : amount);
  });

  return {
    currency: result,
  };
};
