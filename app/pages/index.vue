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
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
      <Trend color="green" title="Income" :amount="4000" :last-amount="3000" :loading="false" />
      <Trend color="red" title="Expenses" :amount="2000" :last-amount="1500" :loading="false" />
      <Trend color="blue" title="Savings" :amount="1500" :last-amount="1200" :loading="false" />
      <Trend
        color="green"
        title="Investments"
        :amount="3500"
        :last-amount="2800"
        :loading="false"
      />
    </section>
  </div>
</template>

<script setup>
import { transactionViewOptions } from '~/constants.ts';
const viewSelected = ref(transactionViewOptions[1]);
</script>
