<script setup lang="ts">
import hero from '@/assets/images/psychologist.png'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="bg-cream py-16 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      <div>
        <h1 class="text-4xl lg:text-5xl font-bold font-serif mb-6 leading-tight">
          Психологічна Підтримка<br />
          При Втратах, Які<br />
          <span class="neon-text">Суспільство Невизнає</span>
        </h1>

        <p class="text-gray-700 font-sans leading-relaxed mb-8">
          <strong>Я, Неля Тройчук — психологиня.</strong>
          Працюю з переживанням втрат: розрив стосунків, розлучення,
          насильство, еміграція, ВПО, втрата здоров’я та втрата домашніх улюбленців.
        </p>

        <div class="flex gap-4">
          <!-- ЗАПИСАТИСЯ -->
          <RouterLink
            to="/book"
            class="px-6 py-3 border-2 rounded-full border-[#F5F1EA] bg-[#E7E1D7]
                   text-[#2A2A2A] font-medium hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
          >
            Записатися
          </RouterLink>

          <!-- ПРО МЕНЕ -->
          <RouterLink
            to="/about"
            class="px-6 py-3 border-2 rounded-full border-[#F5F1EA] bg-[#E7E1D7]
                   text-[#2A2A2A] font-medium hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
          >
            Про мене
          </RouterLink>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="w-90 h-90 rounded-full overflow-hidden bg-gray-200">
          <img :src="hero" alt="Психолог" class="w-full h-full object-cover" />
        </div>
      </div>

    </div>
  </section>
</template>
