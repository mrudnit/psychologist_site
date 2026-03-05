<script setup lang="ts">
import { RouterLink } from 'vue-router'

const services = [
  {
    title: 'Втрата домашнього улюбленця',
    description:
      'супровід на етапах гострого горя, допомога у прийнятті рішення про евтаназію, подолання почуття провини, групи психотерапевтичної підтримки.',
    slug: 'domashnie-ulublenci',
    linkText: 'Читати далі',
  },
  {
    title: 'Втрати вiйни',
    description:
      'втрата дому, звичного способу життя, розрив соціальних зв’язків та вимушена еміграція.',
    slug: 'emigration',
    linkText: 'Читати далі',
  },
  {
    title: '“Невидимі” розриви',
    description:
      'втрата дружби, розлучення, домашнє насильство, втрата здоров’я або нездійснені мрії.',
    slug: 'broken',
    linkText: 'Читати далі',
  },
]
</script>


<template>
  <section class="bg-white py-16 px-6">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold font-serif text-4xl text-center mb-12">З ЧИМ Я ПРАЦЮЮ</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(service, index) in services"
          :key="index"
          class="border-2 border-yellow-border rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col"
        >
          <h3 class="text-lg font-bold font-serif text-4xl mb-4">{{ service.title }}</h3>

          <p class="text-gray-700 mb-6 font-sans leading-relaxed flex-grow">
            {{ service.description }}
          </p>

          <RouterLink
            :to="`/articles/${service.slug}`"
            class="self-start px-5 py-2 border border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A] rounded-full font-medium
            hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
          >
            {{ service.linkText }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
