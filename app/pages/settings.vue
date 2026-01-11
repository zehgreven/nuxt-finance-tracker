<template>
  <div class="flex gap-8 p-8">
    <aside class="w-64">
      <UNavigationMenu
        orientation="vertical"
        :items="items"
        :ui="{
          root: 'w-full',
          list: 'gap-1',
          link: 'px-4 py-2 rounded-md transition-colors',
          linkActive: 'bg-primary-50 text-primary-600 font-semibold dark:bg-primary-950/50',
          linkInactive: 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800',
        }"
      />
    </aside>

    <main class="flex-1 pl-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const items = [
  {
    label: 'Profile',
    icon: 'i-heroicons-user',
    to: '/settings/profile',
  },
  {
    label: 'Avatar',
    icon: 'i-heroicons-photo',
    to: '/settings/avatar',
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth',
    to: '/settings/settings',
  },
];
</script>
