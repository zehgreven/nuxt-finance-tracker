<template>
  <UForm ref="form" :state="state" :schema="schema" @submit="save">
    <UFormField class="mb-4" label="Name" name="name" required>
      <UInput
        v-model="state.name"
        class="w-full"
        type="text"
        placeholder="Enter your name"
        required
      />
    </UFormField>

    <UFormField
      class="mb-4"
      label="Email"
      name="email"
      help="You will receive a confirmation email on both the old and new new addresses if you modify the email address"
      required
    >
      <UInput
        v-model="state.email"
        class="w-full"
        type="email"
        placeholder="Enter your email"
        required
      />
    </UFormField>

    <UButton type="submit" label="Save" color="primary" variant="solid" :loading="pending" />
  </UForm>
</template>

<script setup>
import { z } from 'zod';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useAppToast();
const pending = ref(false);

const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

console.log(user.value);

const schema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(255, { message: 'Name must be at most 255 characters' }),
  email: z.email('Email is required'),
});

const save = async () => {
  pending.value = true;

  try {
    const data = {
      data: {
        full_name: state.value.name,
      },
    };

    if (state.value.email !== user.value.email) {
      data.email = state.value.email;
    }

    const { error } = await supabase.auth.updateUser(data);

    if (error) {
      throw error;
    }

    await supabase.auth.refreshSession();
    toast.success({ title: 'Your profile has been updated' });
  } catch (error) {
    toast.error({
      title: 'Failed to update profile',
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
