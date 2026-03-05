<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/utils/api'

const name = ref('')
const email = ref('')
const message = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  error.value = null
  loading.value = true
  try {
    await api.post('/api/contact', {
      name: name.value,
      email: email.value,
      message: message.value,
    })
    success.value = true
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Сталася помилка. Спробуйте пізніше.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="bg-cream py-14 px-6">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-serif font-bold  text-center mb-10">ЗВ&apos;ЯЗОК</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- LEFT: form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold font-serif text-4xl tracking-wide">ІМ&apos;Я</label>
              <input
                v-model="name"
                type="text"
                class="w-full h-11 px-5 rounded-full border border-gray-300 bg-transparent
                       focus:outline-none focus:border-black"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold font-serif text-4xl tracking-wide">EMAIL</label>
              <input
                v-model="email"
                type="email"
                class="w-full h-11 px-5 rounded-full border border-gray-300 bg-transparent
                       focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold font-serif text-4xl tracking-wide">ПОВІДОМЛЕННЯ</label>
            <textarea
              v-model="message"
              rows="3"
              class="w-full px-5 py-3 rounded-2xl border border-gray-300 bg-transparent
                     focus:outline-none focus:border-black resize-none"
            ></textarea>
          </div>

          <div v-if="success" class="rounded-xl bg-green-50 border border-green-200 px-5 py-3 text-green-800 font-medium">
            ✅ Дякую! Ваше повідомлення надіслано.
          </div>
          <div v-if="error" class="rounded-xl bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-700">
            ⚠️ {{ error }}
          </div>
          <button
            v-if="!success"
            type="submit"
            :disabled="loading"
            class="inline-block px-6 py-3 border-2 border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A] rounded-full font-sans leading-relaxed font-medium hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Надсилаємо…' : 'Відправити' }}
          </button>
        </form>

        <!-- RIGHT: contacts -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">
          <!-- phone+email -->
          <div class="space-y-6 self-center">
            <div class="flex items-center gap-4">
              <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
             <a
              href="tel:+380955617092"
              class="text-base font-serif hover:underline text-[#2A2A2A]"
            >
              +380 955 617 092
            </a>
            </div>

            <div class="flex items-center gap-4">
              <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
             <a
              href="mailto:neliatroichuk@gmail.com"
              class="text-base font-serif hover:underline text-[#2A2A2A]"
            >
              neliatroichuk@gmail.com
            </a>

            </div>
          </div>

          <!-- socials -->
          <div class="space-y-6 lg:justify-self-center">
            <a href="#" class="flex items-center gap-4 hover:opacity-70 transition-opacity">
             <div
              class="w-12 h-12 rounded-full border border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A]
                    flex items-center justify-center
                    hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
            >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
                  />
                </svg>
              </div>
              <span class="font-semibold font-serif tracking-wide">TELEGRAM</span>
            </a>

            <a href="#" class="flex items-center gap-4 hover:opacity-70 transition-opacity">
              <div
                class="w-12 h-12 rounded-full border border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A]
                      flex items-center justify-center
                      hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
              >

                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </div>
              <span class="font-semibold font-serif tracking-wide">FACEBOOK</span>
            </a>

            <a href="#" class="flex items-center gap-4 hover:opacity-70 transition-opacity">
              <div
                class="w-12 h-12 rounded-full border border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A]
                      flex items-center justify-center
                      hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z"
                  />
                  <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  <path d="M17.5 6.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
                </svg>
              </div>
              <span class="font-semibold font-serif tracking-wide">INSTAGRAM</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
