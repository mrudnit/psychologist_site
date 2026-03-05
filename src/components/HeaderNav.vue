<script setup lang="ts">
import logo from '@/assets/images/logo.png'
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const isHidden = ref(false)
let lastY = 0

const onScroll = () => {
  const y = window.scrollY || 0
  if (y > lastY && y > 80) isHidden.value = true
  if (y < lastY) isHidden.value = false
  lastY = y
}

onMounted(() => {
  lastY = window.scrollY || 0
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur transition-transform duration-300 h-16"
    :class="isHidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <div class="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
      <img :src="logo" alt="Аватар" class="h-10 w-auto" />

      <nav class="flex gap-8 items-center">
        <RouterLink
          to="/"
          class="text-sm font-medium text-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
          exact-active-class="bg-gradient-to-r from-[#F5F1EA] to-[#E7E1D7] text-[#2A2A2A] px-4 py-1 rounded-full"
        >
          ГОЛОВНА
        </RouterLink>

        <RouterLink
          to="/about"
          class="text-sm font-medium text-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
          active-class="bg-gradient-to-r from-[#F5F1EA] to-[#E7E1D7] text-[#2A2A2A] px-4 py-1 rounded-full"
        >
          ПРО МЕНЕ
        </RouterLink>

        <RouterLink
          to="/book"
          class="text-sm font-medium text-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
          active-class="bg-gradient-to-r from-[#F5F1EA] to-[#E7E1D7] text-[#2A2A2A] px-4 py-1 rounded-full"
        >
          ПОСЛУГИ
        </RouterLink>

        <RouterLink
          to="/articles"
          class="text-sm font-medium text-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
          active-class="bg-gradient-to-r from-[#F5F1EA] to-[#E7E1D7] text-[#2A2A2A] px-4 py-1 rounded-full"
        >
          СТАТТІ
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
