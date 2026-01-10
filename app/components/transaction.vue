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
            :loading="isLoading"
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

const emit = defineEmits(['deleted']);

const toast = useToast();

const isLoading = ref(false);

const isIncome = computed(() => props.transaction.type.toLowerCase() === 'income');

const icon = computed(() => {
  return isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left';
});

const iconColor = computed(() => {
  return isIncome.value ? 'text-green-500' : 'text-red-500';
});

const { currency } = useCurrency(props.transaction.amount);

const deleteTransaction = async () => {
  isLoading.value = true;
  const supabase = useSupabaseClient();
  const { error } = await supabase.from('transactions').delete().eq('id', props.transaction.id);
  isLoading.value = false;
  if (error) {
    toast.add({
      title: 'Failed to delete transaction',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    });
  } else {
    emit('deleted', props.transaction.id);
    toast.add({
      title: 'Transaction deleted',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    });
  }
};

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
    onSelect: deleteTransaction,
  },
]);
</script>
