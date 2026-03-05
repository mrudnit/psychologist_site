<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api, auth } from '@/utils/api'

const router = useRouter()

// ─── State ────────────────────────────────────────────────────────────────────
type Tab = 'requests' | 'articles'
const activeTab = ref<Tab>('requests')

// Requests
interface BookingRequest {
  id: number
  name: string
  age: string
  helpType: string
  format: string
  lossTiming: string
  phone: string | null
  email: string | null
  messengers: string[]
  promoCode: string | null
  note: string | null
  createdAt: string
}
const requests = ref<BookingRequest[]>([])
const requestsLoading = ref(false)

// Articles
interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverUrl: string | null
  createdAt: string
  updatedAt: string
}
const articles = ref<Article[]>([])
const articlesLoading = ref(false)

// Article form
const showArticleForm = ref(false)
const editingArticle = ref<Article | null>(null)
const articleForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverUrl: '',
})
const articleFormLoading = ref(false)
const articleFormError = ref('')
const uploadingCover = ref(false)

// Delete confirm
const deletingId = ref<number | null>(null)

// ─── Auth guard ───────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!auth.isLoggedIn()) {
    router.push('/admin')
    return
  }
  loadRequests()
  loadArticles()
})

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = () => {
  auth.clearToken()
  router.push('/admin')
}

// ─── Requests ─────────────────────────────────────────────────────────────────
const loadRequests = async () => {
  requestsLoading.value = true
  try {
    requests.value = await api.get<BookingRequest[]>('/api/admin/bookings')
  } catch (err) {
    console.error('Failed to load requests', err)
  } finally {
    requestsLoading.value = false
  }
}

// ─── Articles ─────────────────────────────────────────────────────────────────
const loadArticles = async () => {
  articlesLoading.value = true
  try {
    articles.value = await api.get<Article[]>('/api/admin/articles')
  } catch (err) {
    console.error('Failed to load articles', err)
  } finally {
    articlesLoading.value = false
  }
}

const openNewArticle = () => {
  editingArticle.value = null
  articleForm.value = { title: '', slug: '', excerpt: '', content: '', coverUrl: '' }
  articleFormError.value = ''
  showArticleForm.value = true
}

const openEditArticle = (a: Article) => {
  editingArticle.value = a
  articleForm.value = {
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    coverUrl: a.coverUrl || '',
  }
  articleFormError.value = ''
  showArticleForm.value = true
}

const generateSlug = () => {
  articleForm.value.slug = articleForm.value.title
    .toLowerCase()
    .replace(/[^a-zа-яёїієґ0-9\s-]/gi, '')
    .replace(/[а-яёїієґ]/gi, (c) => {
      const map: Record<string, string> = {
        а:'a',б:'b',в:'v',г:'g',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',
        и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',
        р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',
        щ:'shch',ь:'',ю:'yu',я:'ya',ё:'yo'
      }
      return map[c.toLowerCase()] || c
    })
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const uploadCover = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingCover.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const res = await api.upload<{ url: string }>('/api/admin/upload', formData)
    articleForm.value.coverUrl = res.url
  } catch (err) {
    articleFormError.value = 'Помилка завантаження фото'
    console.error(err)
  } finally {
    uploadingCover.value = false
    input.value = ''
  }
}

const saveArticle = async () => {
  articleFormError.value = ''
  if (!articleForm.value.title || !articleForm.value.slug || !articleForm.value.content) {
    articleFormError.value = 'Заповніть обовʼязкові поля: назва, slug, зміст'
    return
  }

  articleFormLoading.value = true
  try {
    const payload = {
      title: articleForm.value.title,
      slug: articleForm.value.slug,
      excerpt: articleForm.value.excerpt,
      content: articleForm.value.content,
      coverUrl: articleForm.value.coverUrl || null,
    }

    if (editingArticle.value) {
      const updated = await api.put<Article>(`/api/admin/articles/${editingArticle.value.id}`, payload)
      const idx = articles.value.findIndex(a => a.id === editingArticle.value!.id)
      if (idx !== -1) articles.value[idx] = updated
    } else {
      const created = await api.post<Article>('/api/admin/articles', payload)
      articles.value.unshift(created)
    }

    showArticleForm.value = false
    editingArticle.value = null
  } catch (err) {
    articleFormError.value = err instanceof Error ? err.message : 'Сталася помилка'
  } finally {
    articleFormLoading.value = false
  }
}

const deleteArticle = async (id: number) => {
  if (deletingId.value !== id) {
    deletingId.value = id
    return
  }
  // Second click = confirmed
  try {
    await api.delete(`/api/admin/articles/${id}`)
    articles.value = articles.value.filter(a => a.id !== id)
  } catch (err) {
    console.error('Failed to delete', err)
  } finally {
    deletingId.value = null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <div class="min-h-screen bg-[#F7F4EE]">
    <!-- Top bar -->
    <header class="bg-white border-b border-[#F5F1EA] sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="font-serif font-bold text-[#2A2A2A]">Адмін-панель</span>
          <nav class="flex gap-1">
            <button
              @click="activeTab = 'requests'"
              :class="activeTab === 'requests'
                ? 'bg-[#2A2A2A] text-white'
                : 'text-[#2A2A2A] hover:bg-[#F7F4EE]'"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              Заявки
              <span v-if="requests.length" class="ml-1.5 text-xs opacity-75">({{ requests.length }})</span>
            </button>
            <button
              @click="activeTab = 'articles'"
              :class="activeTab === 'articles'
                ? 'bg-[#2A2A2A] text-white'
                : 'text-[#2A2A2A] hover:bg-[#F7F4EE]'"
              class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              Статті
              <span v-if="articles.length" class="ml-1.5 text-xs opacity-75">({{ articles.length }})</span>
            </button>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink to="/" target="_blank" class="text-xs text-[#2A2A2A]/50 hover:text-[#2A2A2A] transition-colors">
            ↗ Сайт
          </RouterLink>
          <button @click="logout" class="text-xs px-3 py-1.5 rounded-full border border-[#F5F1EA] hover:bg-[#F7F4EE] transition-colors text-[#2A2A2A]">
            Вийти
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <!-- ═══════════════════════════════════════════════════════════════════════
           TAB: REQUESTS
      ════════════════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'requests'">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-serif font-bold text-[#2A2A2A]">Заявки на консультацію</h2>
          <button @click="loadRequests" class="text-sm text-[#2A2A2A]/50 hover:text-[#2A2A2A] transition-colors">⟳ Оновити</button>
        </div>

        <div v-if="requestsLoading" class="text-center py-12 text-[#2A2A2A]/40">Завантаження…</div>

        <div v-else-if="requests.length === 0" class="bg-white rounded-2xl border border-[#F5F1EA] p-12 text-center text-[#2A2A2A]/40">
          Заявок поки немає
        </div>

        <!-- Desktop table -->
        <div v-else class="hidden lg:block bg-white rounded-2xl border border-[#F5F1EA] overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-[#F5F1EA] bg-[#F7F4EE]">
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Ім'я</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Вік</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Вид допомоги</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Формат</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Втрата</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Контакт</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Месенджери</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Промокод</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Примітка</th>
                  <th class="text-left px-4 py-3 font-medium text-[#2A2A2A]/60">Дата</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="r in requests"
                  :key="r.id"
                  class="border-b border-[#F5F1EA] last:border-0 hover:bg-[#F7F4EE]/50 transition-colors"
                >
                  <td class="px-4 py-3 font-medium text-[#2A2A2A]">{{ r.name }}</td>
                  <td class="px-4 py-3 text-[#2A2A2A]/70">{{ r.age }}</td>
                  <td class="px-4 py-3 text-[#2A2A2A]/70 max-w-[160px]">
                    <span class="block truncate" :title="r.helpType">{{ r.helpType }}</span>
                  </td>
                  <td class="px-4 py-3 text-[#2A2A2A]/70">{{ r.format }}</td>
                  <td class="px-4 py-3 text-[#2A2A2A]/70 max-w-[140px]">
                    <span class="block truncate" :title="r.lossTiming">{{ r.lossTiming }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <div v-if="r.phone" class="text-[#2A2A2A]/70">{{ r.phone }}</div>
                    <div v-if="r.email" class="text-[#2A2A2A]/70 text-xs">{{ r.email }}</div>
                  </td>
                  <td class="px-4 py-3 text-[#2A2A2A]/70">
                    {{ Array.isArray(r.messengers) ? r.messengers.join(', ') || '—' : '—' }}
                  </td>
                  <td class="px-4 py-3 text-[#2A2A2A]/70">{{ r.promoCode || '—' }}</td>
                  <td class="px-4 py-3 text-[#2A2A2A]/70 max-w-[140px]">
                    <span class="block truncate" :title="r.note || ''">{{ r.note || '—' }}</span>
                  </td>
                  <td class="px-4 py-3 text-[#2A2A2A]/50 text-xs whitespace-nowrap">{{ formatDate(r.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile cards -->
        <div class="lg:hidden space-y-3">
          <div
            v-for="r in requests"
            :key="r.id"
            class="bg-white rounded-2xl border border-[#F5F1EA] p-5 space-y-2"
          >
            <div class="flex justify-between items-start">
              <span class="font-medium text-[#2A2A2A]">{{ r.name }}</span>
              <span class="text-xs text-[#2A2A2A]/40">{{ formatDate(r.createdAt) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div><span class="text-[#2A2A2A]/50">Вік:</span> {{ r.age }}</div>
              <div><span class="text-[#2A2A2A]/50">Формат:</span> {{ r.format }}</div>
              <div class="col-span-2"><span class="text-[#2A2A2A]/50">Допомога:</span> {{ r.helpType }}</div>
              <div class="col-span-2"><span class="text-[#2A2A2A]/50">Втрата:</span> {{ r.lossTiming }}</div>
              <div v-if="r.phone"><span class="text-[#2A2A2A]/50">Тел:</span> {{ r.phone }}</div>
              <div v-if="r.email"><span class="text-[#2A2A2A]/50">Email:</span> {{ r.email }}</div>
              <div v-if="r.messengers?.length"><span class="text-[#2A2A2A]/50">Месенджер:</span> {{ r.messengers.join(', ') }}</div>
              <div v-if="r.note" class="col-span-2"><span class="text-[#2A2A2A]/50">Примітка:</span> {{ r.note }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════════
           TAB: ARTICLES
      ════════════════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'articles'">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-serif font-bold text-[#2A2A2A]">Статті</h2>
          <button
            @click="openNewArticle"
            class="px-5 py-2 bg-[#2A2A2A] text-white rounded-full text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
          >
            + Нова стаття
          </button>
        </div>

        <div v-if="articlesLoading" class="text-center py-12 text-[#2A2A2A]/40">Завантаження…</div>

        <div v-else-if="articles.length === 0" class="bg-white rounded-2xl border border-[#F5F1EA] p-12 text-center text-[#2A2A2A]/40">
          Статей поки немає. Додайте першу!
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="a in articles"
            :key="a.id"
            class="bg-white rounded-2xl border border-[#F5F1EA] overflow-hidden"
          >
            <div class="h-36 overflow-hidden bg-[#F7F4EE] flex items-center justify-center">
              <img v-if="a.coverUrl" :src="a.coverUrl" :alt="a.title" class="w-full h-full object-cover" />
              <span v-else class="text-3xl opacity-20">📝</span>
            </div>
            <div class="p-4">
              <h3 class="font-serif font-medium text-[#2A2A2A] leading-snug mb-1 line-clamp-2">{{ a.title }}</h3>
              <p class="text-xs text-[#2A2A2A]/40 mb-1">slug: {{ a.slug }}</p>
              <p class="text-sm text-[#2A2A2A]/60 line-clamp-2 mb-4">{{ a.excerpt }}</p>
              <div class="flex items-center gap-2">
                <button
                  @click="openEditArticle(a)"
                  class="flex-1 py-2 rounded-xl border border-[#F5F1EA] bg-[#F7F4EE] text-[#2A2A2A] text-sm hover:bg-[#E7E1D7] transition-colors"
                >
                  Редагувати
                </button>
                <RouterLink
                  :to="`/articles/${a.slug}`"
                  target="_blank"
                  class="py-2 px-3 rounded-xl border border-[#F5F1EA] text-[#2A2A2A]/60 text-sm hover:bg-[#F7F4EE] transition-colors"
                  title="Переглянути на сайті"
                >
                  ↗
                </RouterLink>
                <button
                  @click="deleteArticle(a.id)"
                  :class="deletingId === a.id ? 'bg-red-600 text-white border-red-600' : 'border-[#F5F1EA] text-[#2A2A2A]/40 hover:text-red-500 hover:border-red-200'"
                  class="py-2 px-3 rounded-xl border text-sm transition-colors"
                  :title="deletingId === a.id ? 'Натисніть ще раз для підтвердження' : 'Видалити'"
                >
                  {{ deletingId === a.id ? '✓ Так?' : '✕' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ═══════════════════════════════════════════════════════════════════════
         ARTICLE FORM MODAL
    ════════════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div
        v-if="showArticleForm"
        class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="showArticleForm = false" />

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl border border-[#F5F1EA] shadow-xl w-full max-w-2xl my-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#F5F1EA]">
            <h3 class="font-serif font-bold text-[#2A2A2A]">
              {{ editingArticle ? 'Редагувати статтю' : 'Нова стаття' }}
            </h3>
            <button @click="showArticleForm = false" class="text-[#2A2A2A]/40 hover:text-[#2A2A2A] transition-colors text-xl leading-none">✕</button>
          </div>

          <div class="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">

            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-[#2A2A2A] mb-1.5">Назва <span class="text-red-500">*</span></label>
              <input
                v-model="articleForm.title"
                @input="!editingArticle && generateSlug()"
                type="text"
                placeholder="Назва статті"
                class="w-full rounded-xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-2.5 text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#E7E1D7]"
              />
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-sm font-medium text-[#2A2A2A] mb-1.5">
                Slug <span class="text-red-500">*</span>
                <span class="text-xs font-normal text-[#2A2A2A]/40 ml-1">(URL-адреса, тільки латиниця і дефіс)</span>
              </label>
              <div class="flex gap-2">
                <input
                  v-model="articleForm.slug"
                  type="text"
                  placeholder="moia-stattia"
                  class="flex-1 rounded-xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-2.5 text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#E7E1D7]"
                />
                <button
                  type="button"
                  @click="generateSlug"
                  class="px-3 py-2.5 rounded-xl border border-[#F5F1EA] text-sm text-[#2A2A2A]/60 hover:bg-[#F7F4EE] transition-colors whitespace-nowrap"
                >
                  ⟳ З назви
                </button>
              </div>
            </div>

            <!-- Excerpt -->
            <div>
              <label class="block text-sm font-medium text-[#2A2A2A] mb-1.5">Короткий опис</label>
              <textarea
                v-model="articleForm.excerpt"
                rows="2"
                placeholder="1-2 речення для превʼю"
                class="w-full rounded-xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-2.5 text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#E7E1D7] resize-none"
              />
            </div>

            <!-- Content -->
            <div>
              <label class="block text-sm font-medium text-[#2A2A2A] mb-1.5">
                Зміст <span class="text-red-500">*</span>
                <span class="text-xs font-normal text-[#2A2A2A]/40 ml-1">(підтримується HTML)</span>
              </label>
              <textarea
                v-model="articleForm.content"
                rows="10"
                placeholder="<p>Текст статті...</p>"
                class="w-full rounded-xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-2.5 text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#E7E1D7] resize-y font-mono text-sm"
              />
            </div>

            <!-- Cover -->
            <div>
              <label class="block text-sm font-medium text-[#2A2A2A] mb-1.5">Обкладинка</label>
              <div class="flex gap-3 items-start">
                <div v-if="articleForm.coverUrl" class="w-20 h-16 rounded-xl overflow-hidden border border-[#F5F1EA] flex-shrink-0">
                  <img :src="articleForm.coverUrl" alt="Cover" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 space-y-2">
                  <label class="block w-full text-center px-4 py-2.5 rounded-xl border border-dashed border-[#E7E1D7] text-sm text-[#2A2A2A]/60 hover:bg-[#F7F4EE] cursor-pointer transition-colors">
                    <span v-if="uploadingCover">Завантаження…</span>
                    <span v-else>📎 Завантажити фото</span>
                    <input type="file" accept="image/*" class="hidden" @change="uploadCover" :disabled="uploadingCover" />
                  </label>
                  <input
                    v-model="articleForm.coverUrl"
                    type="text"
                    placeholder="або вставте URL фото"
                    class="w-full rounded-xl border border-[#F5F1EA] bg-[#F7F4EE] px-3 py-2 text-xs text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#E7E1D7]"
                  />
                </div>
              </div>
            </div>

            <!-- Error -->
            <div v-if="articleFormError" class="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {{ articleFormError }}
            </div>
          </div>

          <div class="flex gap-3 px-6 py-4 border-t border-[#F5F1EA]">
            <button
              @click="showArticleForm = false"
              class="flex-1 py-2.5 rounded-xl border border-[#F5F1EA] text-[#2A2A2A] text-sm hover:bg-[#F7F4EE] transition-colors"
            >
              Скасувати
            </button>
            <button
              @click="saveArticle"
              :disabled="articleFormLoading"
              class="flex-1 py-2.5 rounded-xl bg-[#2A2A2A] text-white text-sm font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
            >
              {{ articleFormLoading ? 'Зберігаємо…' : editingArticle ? 'Зберегти зміни' : 'Створити статтю' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
