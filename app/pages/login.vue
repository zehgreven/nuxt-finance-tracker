<template>
  <UCard v-if="!success">
    <template #header> Sign-in to Finance Tracker </template>

    <template #default>
      <UForm ref="form" :state="state" :schema="schema" @submit="handleLogin">
        <UFormField
          class="mb-4"
          label="Email"
          name="email"
          help="You will receive an email with the confirmation link"
          required
        >
          <UInput
            v-model.number="state.email"
            class="w-full"
            type="email"
            placeholder="i.e. john.doe@example.com"
            required
          />
        </UFormField>

        <UButton type="submit" label="Sign-in" color="primary" variant="solid" :loading="pending" />
      </UForm>
    </template>
  </UCard>

  <UCard v-else>
    <template #header> Email has been sent </template>

    <div class="text-center">
      <p class="mb-4">
        An email has been sent to <strong>{{ state.email }}</strong
        >.
      </p>
      <p>Please check your inbox and click on the link to sign-in.</p>
      <p>If you don't see the email, check your spam folder.</p>
      <p class="mt-4"><strong>Important:</strong> This link is only valid for 5 minutes.</p>
    </div>
  </UCard>
</template>

<script setup>
import { z } from 'zod';

useHead({
  title: 'Finance Tracker | Login',
});

const supabase = useSupabaseClient();
const toast = useToast();
const success = ref(false);
const pending = ref(false);
const form = ref(null);
const initialState = {
  email: undefined,
};

const state = ref({ ...initialState });

const schema = z.object({
  email: z.email({ message: 'Email is required' }),
});

useRedirectedWhenAuthenticated();

const handleLogin = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: state.value.email,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm',
      },
    });

    if (error) {
      throw error;
    }

    success.value = true;
  } catch (error) {
    toast.add({
      title: 'Failed to sign-in',
      description: error.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'error',
    });
  } finally {
    pending.value = false;
  }
};
</script>
