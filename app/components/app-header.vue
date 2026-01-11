<template>
  <header class="flex justify-between items-center mt-10">
    <NuxtLink to="/" class="text-xl font-bold"> Finance Tracker </NuxtLink>

    <div>
      <UDropdownMenu
        v-if="user"
        :items="items"
        :ui="{
          item: 'cursor-pointer disabled:cursor-text! disabled:select-text',
          content: 'w-64',
        }"
        :content="{
          align: 'end',
          side: 'bottom',
        }"
      >
        <UAvatar
          size="sm"
          src="https://avatars.githubusercontent.com/u/11966764?v=4"
          alt="Avatar"
          class="hover:cursor-pointer"
        />

        <template #account="{ item }">
          <div class="text-left">
            <p>Signed in as</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ user.email }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>

          <UIcon
            :name="item.icon"
            class="shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
          />
        </template>
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const items = [
  [
    {
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      onClick: () => console.log('Link to settings in the future'),
    },
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      onClick: async () => {
        await supabase.auth.signOut();
        return navigateTo('/login');
      },
    },
  ],
];
</script>
