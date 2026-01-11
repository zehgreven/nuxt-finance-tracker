<template>
  <UModal v-model="showModal">
    <UButton
      icon="i-heroicons-plus-circle"
      color="neutral"
      variant="outline"
      label="Add"
      @click="showModal = true"
    />
    <template #header>Add Transaction</template>
    <template #body>
      <UForm :state="state" :schema="schema" @submit="save">
        <UFormField class="mb-4" label="Transaction Type" name="type" required>
          <USelect
            v-model="state.type"
            class="w-full"
            placeholder="Select the transaction type"
            :items="types"
            required
          />
        </UFormField>

        <UFormField class="mb-4" label="Amount" name="amount" required>
          <UInput
            v-model.number="state.amount"
            class="w-full"
            type="number"
            placeholder="Enter amount"
            required
          />
        </UFormField>

        <UFormField class="mb-4" label="Transaction Date" name="created_at" required>
          <UInput
            v-model="state.created_at"
            class="w-full"
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            required
          />
        </UFormField>

        <UFormField class="mb-4" label="Description" hint="Optional" name="description">
          <UInput
            v-model="state.description"
            class="w-full"
            type="text"
            placeholder="Enter description"
          />
        </UFormField>

        <UFormField class="mb-4" label="Category" name="category" required>
          <USelect
            v-model="state.category"
            class="w-full"
            placeholder="Select the category"
            :items="categories"
            required
          />
        </UFormField>

        <UButton type="submit" label="Save" color="primary" variant="solid" />
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
import { categories, types } from '~/constants';
import { z } from 'zod';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue']);

const showModal = computed({
  get: () => props.modelValue,
  set: value => {
    if (value === false) {
      resetForm();
    }
    emit('update:modelValue', value);
  },
});

const supabase = useSupabaseClient();

const save = async () => {
  if (form.value.erros.length) {
    return;
  }

  supabase.from('transactions').insert([
    {
      type: state.value.type,
      amount: state.value.amount,
      created_at: state.value.created_at,
      description: state.value.description,
      category: state.value.category,
    },
  ]);
};

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};

const state = ref({ ...initialState });

const resetForm = () => {
  state.value = { ...initialState };
  form.value.clear();
};

const schema = z.object({
  type: z.enum(types, { message: 'Transaction type is required' }),
  amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
  created_at: z.string().nonempty({ message: 'Transaction date is required' }),
  description: z.string().optional(),
  category: z.enum(categories, { message: 'Category is required' }),
});
</script>
