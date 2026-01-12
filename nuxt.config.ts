// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/supabase'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    },
  },
});
