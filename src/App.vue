<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderNav from './components/HeaderNav.vue'
import ContactSection from './components/ContactSection.vue'

const route = useRoute()
// Don't show site chrome on admin pages
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <!-- Admin pages: no nav, no contact section -->
  <template v-if="isAdmin">
    <RouterView />
  </template>

  <!-- Public pages: full layout -->
  <template v-else>
    <HeaderNav />
    <main class="pt-16 min-h-screen bg-white">
      <RouterView />
    </main>
    <ContactSection />
  </template>
</template>
