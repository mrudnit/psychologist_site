<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articles as localArticles } from '../data/articles'

interface ApiArticle {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverUrl: string | null
  createdAt: string
}

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const article = ref<{ title: string; cover: string; content: string; date?: string } | null>(null)
const notFound = ref(false)
const loading = ref(true)

async function loadArticle(slugVal: string) {
  loading.value = true
  notFound.value = false
  article.value = null

  // Try API first
  try {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const res = await fetch(`${BASE_URL}/api/articles/${slugVal}`)
    if (res.ok) {
      const data: ApiArticle = await res.json()
      article.value = {
        title: data.title,
        cover: data.coverUrl || '',
        content: data.content,
        date: new Date(data.createdAt).toLocaleDateString('uk-UA'),
      }
      loading.value = false
      return
    }
  } catch {
    // fall through to local
  }

  // Fallback to local data
  const local = localArticles.find(a => a.slug === slugVal)
  if (local) {
    article.value = {
      title: local.title,
      cover: local.cover,
      content: local.content,
      date: local.date,
    }
  } else {
    notFound.value = true
  }
  loading.value = false
}

onMounted(() => loadArticle(slug.value))
watch(slug, (s) => loadArticle(s))
</script>

<template>
  <section class="py-16 px-6 bg-white">
    <div class="max-w-3xl mx-auto">
      <div v-if="loading" class="mt-10 text-center text-gray-400">Завантаження…</div>

      <div v-else-if="article" class="mt-6">
        <img v-if="article.cover" :src="article.cover" :alt="article.title" class="w-full h-auto rounded-2xl mb-8" />
        <h1 class="text-3xl font-serif mb-4">{{ article.title }}</h1>
        <p v-if="article.date" class="text-sm text-gray-500 mb-8">{{ article.date }}</p>

        <div class="prose max-w-none" v-html="article.content"></div>

        <div class="flex justify-end mt-8">
          <RouterLink
            to="/articles"
            class="self-end inline-flex items-center gap-2 px-5 py-2
                  border border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A]
                  rounded-full font-medium transition-colors
                  hover:bg-[#2A2A2A] hover:text-[#E7E1D7]"
          >
            ← Назад до списку
          </RouterLink>
        </div>
      </div>

      <div v-else class="mt-10 text-gray-700">
        Стаття не знайдена.
      </div>
    </div>
  </section>
</template>
