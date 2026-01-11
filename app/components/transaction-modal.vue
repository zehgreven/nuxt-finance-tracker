<template>
  <UModal v-model:open="open" title="Add Transaction">
    <UButton icon="i-heroicons-plus-circle" color="neutral" variant="outline" label="Add" />

    <template #body>
      <UModalContent>
        <UModalBody>
          <UForm ref="form" :state="state" :schema="schema" @submit="save">
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

            <UButton
              type="submit"
              label="Save"
              color="primary"
              variant="solid"
              :loading="isLoading"
            />
          </UForm>
        </UModalBody>
      </UModalContent>
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
const emit = defineEmits(['update:modelValue', 'saved']);

const open = computed({
  get: () => props.modelValue,
  set: val => {
    if (!val) resetForm();
    emit('update:modelValue', val);
  },
});

const supabase = useSupabaseClient();
const toast = useToast();
const form = ref(null);
const isLoading = ref(false);

const save = async () => {
  try {
    isLoading.value = true;
    const { error } = await supabase
      .from('transactions')
      .upsert([{ ...state.value, amount: Number(state.value.amount) }]);

    if (error) {
      throw error;
    }

    toast.add({
      title: 'Transaction saved',
      icon: 'i-heroicons-check-circle',
      color: 'success',
    });
    emit('saved');
    open.value = false;
  } catch (error) {
    toast.add({
      title: 'Failed to save transaction',
      description: error.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    });
  } finally {
    isLoading.value = false;
  }
};

const initialState = {
  type: 'Income',
  amount: 10,
  created_at: new Date().toISOString().slice(0, 10),
  description: 'teest',
  category: 'Other',
};

const state = ref({ ...initialState });

const resetForm = () => {
  state.value = { ...initialState };
  try {
    form.value?.clear();
  } catch (e) {
    // Silencioso: o componente já está fechando mesmo
  }
};

const schema = z.object({
  type: z.enum(types, { message: 'Transaction type is required' }),
  amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
  created_at: z.string().nonempty({ message: 'Transaction date is required' }),
  description: z.string().optional(),
  category: z.enum(categories, { message: 'Category is required' }),
});
</script>
