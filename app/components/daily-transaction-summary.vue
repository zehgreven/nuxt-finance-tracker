<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-greay-500 dark:text-gray-400 last:border-0 font-bold"
  >
    <div class="flex items-center justify-between">
      {{ date }}
    </div>
    <div class="flex items-center justify-end mr-10">
      {{ currency }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const sum = computed(() => {
  return props.transactions.reduce((sum, transaction) => {
    if (transaction.type.toLowerCase() === 'income') {
      sum += transaction.amount;
    } else {
      sum -= transaction.amount;
    }
    return sum;
  }, 0);
});

const { currency } = useCurrency(sum);
</script>
