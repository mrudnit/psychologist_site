<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { api } from '@/utils/api'

type AgeOption = '18-30' | '31-45' | '46-60' | '61+'
type LossWhenOption = 'До 2 тижнів' | 'Від 2 тижнів до 2 місяців тому' | 'Від 2 до 4 місяців тому' | '4 місяці тому і більше'
type HelpTypeOption =
  | 'Підтримка при втраті тварини'
  | 'Підтримка для тих, кому нема куди повертатися'
  | 'Розрив стосунків / розлучення'
  | 'Домашнє насильство'
  | 'Інші “невидимі” втрати'
type FormatOption = 'Індивідуально' | 'Група' | 'Не знаю, підкажіть'
type Messenger = 'Telegram' | 'Viber' | 'WhatsApp'

const form = reactive({
  name: '',
  age: '' as '' | AgeOption,
  helpType: '' as '' | HelpTypeOption,
  format: 'Індивідуально' as FormatOption,
  lossWhen: '' as '' | LossWhenOption,
  phone: '',
  messengers: [] as Messenger[],
  email: '',
  promo: '',
  note: '',
})

const submitted = ref(false)
const submitLoading = ref(false)
const submitSuccess = ref(false)
const submitError = ref<string | null>(null)
const isValid = computed(() => {
  return (
    form.name.trim().length >= 2 &&
    !!form.age &&
    !!form.helpType &&
    !!form.lossWhen &&
    (form.phone.trim().length >= 8 || form.email.trim().includes('@'))
  )
})

const toggleMessenger = (m: Messenger) => {
  const i = form.messengers.indexOf(m)
  if (i >= 0) form.messengers.splice(i, 1)
  else form.messengers.push(m)
}

const onSubmit = async () => {
  submitted.value = true
  submitError.value = null
  if (!isValid.value) return

  submitLoading.value = true
  try {
    await api.post('/api/booking', {
      name: form.name,
      age: form.age,
      helpType: form.helpType,
      format: form.format,
      lossTiming: form.lossWhen,
      phone: form.phone || null,
      email: form.email || null,
      messengers: form.messengers,
      promoCode: form.promo || null,
      note: form.note || null,
    })
    submitSuccess.value = true
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Сталася помилка. Спробуйте пізніше.'
  } finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <section class="bg-white py-16 px-6">
    <div class="max-w-3xl mx-auto">
      <!-- Заголовок -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-serif font-bold text-[#2A2A2A] mb-3">
          Запис на консультацію
        </h1>
        <p class="text-[#2A2A2A]/70 leading-relaxed">
          Заповніть форму — і я напишу вам для узгодження часу та формату.
          <span class="block mt-1">Поля з * — обов’язкові.</span>
        </p>
      </div>

      <!-- Карточка формы -->
      <form
        class="rounded-2xl border border-[#F5F1EA] bg-white shadow-sm p-6 sm:p-8 space-y-8"
        @submit.prevent="onSubmit"
      >
        <!-- Ваше ім'я -->
        <div>
          <label class="block text-sm font-medium text-[#2A2A2A] mb-2">
            Ваше ім'я <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Наприклад: Олена"
            class="w-full rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 text-[#2A2A2A]
                   outline-none focus:ring-2 focus:ring-[#E7E1D7]"
          />
          <p v-if="submitted && form.name.trim().length < 2" class="mt-2 text-sm text-red-500">
            Вкажіть ім’я (мінімум 2 символи).
          </p>
        </div>

        <!-- Вік -->
        <div>
          <label class="block text-sm font-medium text-[#2A2A2A] mb-3">
            Ваш вік <span class="text-red-500">*</span>
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="flex items-center gap-3 rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 cursor-pointer">
              <input v-model="form.age" class="accent-[#2A2A2A]" type="radio" name="age" value="18-30" />
              <span class="text-[#2A2A2A]">18–30</span>
            </label>
            <label class="flex items-center gap-3 rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 cursor-pointer">
              <input v-model="form.age" class="accent-[#2A2A2A]" type="radio" name="age" value="31-45" />
              <span class="text-[#2A2A2A]">31–45</span>
            </label>
            <label class="flex items-center gap-3 rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 cursor-pointer">
              <input v-model="form.age" class="accent-[#2A2A2A]" type="radio" name="age" value="46-60" />
              <span class="text-[#2A2A2A]">46–60</span>
            </label>
            <label class="flex items-center gap-3 rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 cursor-pointer">
              <input v-model="form.age" class="accent-[#2A2A2A]" type="radio" name="age" value="61+" />
              <span class="text-[#2A2A2A]">61 і старші</span>
            </label>
          </div>

          <p v-if="submitted && !form.age" class="mt-2 text-sm text-red-500">
            Оберіть варіант віку.
          </p>
        </div>

        <!-- Вид допомоги + формат -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-[#2A2A2A] mb-2">
              Оберіть вид допомоги <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.helpType"
              class="w-full rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 text-[#2A2A2A]
                     outline-none focus:ring-2 focus:ring-[#E7E1D7]"
            >
              <option disabled value="">Оберіть…</option>
              <option>Підтримка при втраті тварини</option>
              <option>Підтримка для тих, кому нема куди повертатися</option>
              <option>Розрив стосунків / розлучення</option>
              <option>Домашнє насильство</option>
              <option>Інші “невидимі” втрати</option>
            </select>
            <p v-if="submitted && !form.helpType" class="mt-2 text-sm text-red-500">
              Оберіть вид допомоги.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#2A2A2A] mb-2">
              Бажаєте отримати підтримку
            </label>
            <select
              v-model="form.format"
              class="w-full rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 text-[#2A2A2A]
                     outline-none focus:ring-2 focus:ring-[#E7E1D7]"
            >
              <option>Індивідуально</option>
              <option>Група</option>
              <option>Не знаю, підкажіть</option>
            </select>
          </div>
        </div>

        <!-- Як давно сталася втрата -->
        <div>
          <label class="block text-sm font-medium text-[#2A2A2A] mb-3">
            Як давно сталася втрата <span class="text-red-500">*</span>
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="flex items-center gap-3 rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 cursor-pointer">
              <input v-model="form.lossWhen" class="accent-[#2A2A2A]" type="radio" name="loss" value="До 2 тижнів" />
              <span class="text-[#2A2A2A]">До 2 тижнів</span>
            </label>

            <label class="flex items-center gap-3 rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 cursor-pointer">
              <input v-model="form.lossWhen" class="accent-[#2A2A2A]" type="radio" name="loss" value="Від 2 тижнів до 2 місяців тому" />
              <span class="text-[#2A2A2A]">Від 2 тижнів до 2 місяців тому</span>
            </label>

            <label class="flex items-center gap-3 rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 cursor-pointer">
              <input v-model="form.lossWhen" class="accent-[#2A2A2A]" type="radio" name="loss" value="Від 2 до 4 місяців тому" />
              <span class="text-[#2A2A2A]">Від 2 до 4 місяців тому</span>
            </label>

            <label class="flex items-center gap-3 rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 cursor-pointer">
              <input v-model="form.lossWhen" class="accent-[#2A2A2A]" type="radio" name="loss" value="4 місяці тому і більше" />
              <span class="text-[#2A2A2A]">4 місяці тому і більше</span>
            </label>
          </div>

          <p v-if="submitted && !form.lossWhen" class="mt-2 text-sm text-red-500">
            Оберіть, як давно сталася втрата.
          </p>
        </div>

        <!-- Контакты -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-[#2A2A2A] mb-2">
              Ваш номер телефону для зв’язку
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+380…"
              class="w-full rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 text-[#2A2A2A]
                     outline-none focus:ring-2 focus:ring-[#E7E1D7]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#2A2A2A] mb-2">
              Email для зв’язку
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="name@email.com"
              class="w-full rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 text-[#2A2A2A]
                     outline-none focus:ring-2 focus:ring-[#E7E1D7]"
            />
          </div>
        </div>

        <p v-if="submitted && !(form.phone.trim().length >= 8 || form.email.trim().includes('@'))" class="text-sm text-red-500">
          Вкажіть телефон або коректний email.
        </p>

        <!-- Месенджер -->
        <div>
          <label class="block text-sm font-medium text-[#2A2A2A] mb-3">
            В якому месенджері вам зручно спілкуватися
          </label>

          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="px-4 py-2 rounded-full border border-[#F5F1EA] transition-colors"
              :class="form.messengers.includes('Telegram')
                ? 'bg-[#2A2A2A] text-[#E7E1D7]'
                : 'bg-[#E7E1D7] text-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#E7E1D7]'"
              @click="toggleMessenger('Telegram')"
            >
              Telegram
            </button>

            <button
              type="button"
              class="px-4 py-2 rounded-full border border-[#F5F1EA] transition-colors"
              :class="form.messengers.includes('Viber')
                ? 'bg-[#2A2A2A] text-[#E7E1D7]'
                : 'bg-[#E7E1D7] text-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#E7E1D7]'"
              @click="toggleMessenger('Viber')"
            >
              Viber
            </button>

            <button
              type="button"
              class="px-4 py-2 rounded-full border border-[#F5F1EA] transition-colors"
              :class="form.messengers.includes('WhatsApp')
                ? 'bg-[#2A2A2A] text-[#E7E1D7]'
                : 'bg-[#E7E1D7] text-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#E7E1D7]'"
              @click="toggleMessenger('WhatsApp')"
            >
              WhatsApp
            </button>
          </div>
        </div>

        <!-- Промокод + примітка -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-[#2A2A2A] mb-2">
              Промокод (якщо є знижка)
            </label>
            <input
              v-model="form.promo"
              type="text"
              placeholder="PROMO"
              class="w-full rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 text-[#2A2A2A]
                     outline-none focus:ring-2 focus:ring-[#E7E1D7]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#2A2A2A] mb-2">
              Коротко про запит (за бажанням)
            </label>
            <input
              v-model="form.note"
              type="text"
              placeholder="1–2 речення"
              class="w-full rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] px-4 py-3 text-[#2A2A2A]
                     outline-none focus:ring-2 focus:ring-[#E7E1D7]"
            />
          </div>
        </div>

        <!-- Submit -->
        <div v-if="submitSuccess" class="rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
          <p class="text-green-800 font-medium text-lg">✅ Дякую! Заявку надіслано.</p>
          <p class="text-green-700 text-sm mt-1">Я зв'яжуся з вами найближчим часом.</p>
        </div>

        <div v-else>
          <div v-if="submitError" class="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ⚠️ {{ submitError }}
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <p class="text-sm text-[#2A2A2A]/60 leading-relaxed">
              Натискаючи “Надіслати”, ви погоджуєтесь, що я зв'яжуся з вами для узгодження деталей.
            </p>
            <button
              type="submit"
              :disabled="submitLoading"
              class="px-7 py-3 border-2 rounded-full border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A] font-medium hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ submitLoading ? 'Надсилаємо…' : 'Надіслати' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
