<script setup lang="ts">
import img1 from '@/assets/images/psychlogichna_bezpeka.png'
import img2 from '@/assets/images/bezpravne_gore.png'
import img3 from '@/assets/images/navchannia_fahivciv.png'
const articles = [
  { title: 'ПСИХОЛОГІЧНА БЕЗПЕКА', image: img1 },
  { title: 'БЕЗПРАВНЕ ГОРЕ', image: img2 },
  { title: 'ІНФОРМАЦІЯ ДЛЯ ФАХІВ', image: img3 }
];
</script>

<template>
  <section class="bg-white py-16 px-6">
    <div class="max-w-7xl mx-auto">
      <h2 class="font-bold font-serif text-4xl text-center mb-12">СТАТТІ</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(article, index) in articles"
          :key="index"
          class="group cursor-pointer"
        >
          <div class="overflow-hidden rounded-2xl mb-4 aspect-square">
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
          </div>
          <h3 class="text-center font-serif text-4xl font-bold text-sm">{{ article.title }}</h3>
        </div>
      </div>

      <div class="text-center mt-8">
        <RouterLink
          to="/articles"
          class="inline-block px-6 py-3 border-2 border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A] rounded-full font-sans font-medium hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
        >
          Читати інші!
        </RouterLink>
      </div>
    </div>
  </section>
</template>
