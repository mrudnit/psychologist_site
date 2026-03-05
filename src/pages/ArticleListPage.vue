<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { articles as localArticles } from '../data/articles'

interface ApiArticle {
  id: number
  title: string
  slug: string
  excerpt: string
  coverUrl: string | null
  createdAt: string
}

// Merge API articles with local static ones
const articles = ref<Array<{ slug: string; title: string; excerpt: string; cover: string }>>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const res = await fetch(`${BASE_URL}/api/articles`)
    if (res.ok) {
      const apiArticles: ApiArticle[] = await res.json()
      // API articles first, then local ones not already in API
      const apiSlugs = new Set(apiArticles.map(a => a.slug))
      const remaining = localArticles.filter(a => !apiSlugs.has(a.slug))
      articles.value = [
        ...apiArticles.map(a => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          cover: a.coverUrl || '',
        })),
        ...remaining.map(a => ({ slug: a.slug, title: a.title, excerpt: a.excerpt, cover: a.cover })),
      ]
      return
    }
  } catch {
    // Backend not available — use local data
  }
  // Fallback to local articles
  articles.value = localArticles.map(a => ({
    slug: a.slug, title: a.title, excerpt: a.excerpt, cover: a.cover,
  }))
  loading.value = false
})

const onLoad = () => { loading.value = false }
</script>

<template>
  <section class="py-16 px-6 bg-white">
    <div class="max-w-5xl mx-auto">
      <h1 class="font-bold font-serif text-4xl text-center mb-12">СТАТТI</h1>

      <div v-if="loading && articles.length === 0" class="text-center py-12 text-gray-400">
        Завантаження…
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <article
          v-for="a in articles"
          :key="a.slug"
          class="rounded-2xl border border-[#F5F1EA] overflow-hidden hover:shadow-lg transition-shadow bg-white"
        >
          <img v-if="a.cover" :src="a.cover" :alt="a.title" class="w-full h-56 object-cover" @load="onLoad" />
          <div v-else class="w-full h-56 bg-[#F7F4EE] flex items-center justify-center text-[#2A2A2A]/30 text-4xl">📝</div>

          <div class="p-6 flex flex-col">
            <h2 class="text-xl font-serif mb-2">{{ a.title }}</h2>
            <p class="text-sm text-gray-700 leading-relaxed mb-6 flex-grow">{{ a.excerpt }}</p>
            <RouterLink
              :to="`/articles/${a.slug}`"
              class="self-start px-5 py-2 border border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A] rounded-full font-medium
                     hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
            >
              Читати
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
