<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div v-else>${{ amount }}</div>
    </div>
    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex gap-1 items-center text-sm">
        <UIcon name="i-heroicons-arrow-trending-up" class="w-6 h-6" :class="[color]" />
        <div class="text-gray-500 dark:text-gray-400">30% vs last period</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
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
.blue {
  @apply text-blue-600 dark:text-blue-400;
}
</style>
