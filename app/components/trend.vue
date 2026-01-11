<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div v-else>{{ currency }}</div>
    </div>
    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex gap-1 items-center text-sm">
        <UIcon :name="icon" class="w-6 h-6" :class="{ green: trendingUp, red: !trendingUp }" />
        <div class="text-gray-500 dark:text-gray-400">{{ percentageChange }}% vs last period</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  lastAmount: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    default: 'green',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const trendingUp = computed(() => props.amount >= props.lastAmount);

const icon = computed(() =>
  trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down',
);

const { currency } = useCurrency(props.amount);

const percentageChange = computed(() => {
  if (props.lastAmount === 0) return 0;
  const bigger = Math.max(props.amount, props.lastAmount);
  const lower = Math.min(props.amount, props.lastAmount);
  const ratio = ((bigger - lower) / lower) * 100;
  return Math.ceil(ratio);
});
</script>

<style scoped>
@reference "../assets/css/main.css";
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
