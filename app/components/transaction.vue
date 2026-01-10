<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-greay-900 dark:text-gray-100 last:border-0"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
        <UIcon :name="icon" class="w-6 h-6 mr-2" :class="iconColor" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge v-if="transaction.category" color="neutral" variant="outline">
          {{ transaction.category }}
        </UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end gap-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdownMenu
          :items="items"
          :content="{
            align: 'end',
            side: 'bottom',
          }"
        >
          <UButton
            trailing-icon="i-heroicons-ellipsis-horizontal"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const isIncome = computed(() => props.transaction.type.toLowerCase() === 'income');

const icon = computed(() => {
  return isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left';
});

const iconColor = computed(() => {
  return isIncome.value ? 'text-green-500' : 'text-red-500';
});

const { currency } = useCurrency(props.transaction.amount, 'pt-BR', 'BRL');

const items = ref([
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    onSelect: () => {
      console.log('Edit clicked');
    },
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    onSelect: () => {
      console.log('Delete clicked');
    },
  },
]);
</script>
