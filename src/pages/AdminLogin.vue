<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, auth } from '@/utils/api'

const router = useRouter()
const password = ref('')
const loading = ref(false)
const error = ref('')

const onLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await api.post<{ token: string }>('/api/admin/login', { password: password.value })
    auth.setToken(res.token)
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Невірний пароль'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F7F4EE] flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-serif font-bold text-[#2A2A2A]">Адмін-панель</h1>
        <p class="text-[#2A2A2A]/60 mt-2 text-sm">Введіть пароль для входу</p>
      </div>

      <form @submit.prevent="onLogin" class="bg-white rounded-2xl border border-[#F5F1EA] shadow-sm p-8 space-y-5">
        <div>
          <label class="block text-sm font-medium text-[#2A2A2A] mb-2">Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            autofocus
            class="w-full rounded-xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 text-[#2A2A2A] outline-none focus:ring-2 focus:ring-[#E7E1D7]"
          />
        </div>

        <div v-if="error" class="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading || !password"
          class="w-full py-3 px-6 rounded-xl bg-[#2A2A2A] text-[#F7F4EE] font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Вхід…' : 'Увійти' }}
        </button>
      </form>

      <p class="text-center text-xs text-[#2A2A2A]/40 mt-6">← <RouterLink to="/" class="hover:underline">Повернутися на сайт</RouterLink></p>
    </div>
  </div>
</template>
