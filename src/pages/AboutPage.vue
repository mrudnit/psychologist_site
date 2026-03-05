<script setup lang="ts">
import hero from '@/assets/images/psychologist.png'
import { ref } from 'vue'

import diploma1 from '@/assets/images/diplomas/diploma1.png'
import diploma2 from '@/assets/images/diplomas/diploma2.jpg'
import diploma3 from '@/assets/images/diplomas/diploma3.png'
import diploma4 from '@/assets/images/diplomas/diploma4.png'
import diploma5 from '@/assets/images/diplomas/diploma5.jpg'
import diploma6 from '@/assets/images/diplomas/diploma6.png'

const diplomas = [
  { src: diploma1, alt: 'Диплом 1' },
  { src: diploma2, alt: 'Диплом 2' },
  { src: diploma3, alt: 'Диплом 3' },
  { src: diploma4, alt: 'Диплом 4' },
  { src: diploma5, alt: 'Диплом 5' },
  { src: diploma6, alt: 'Диплом 6' },
]

const diplomasRow = ref<HTMLElement | null>(null)

const scrollDiplomas = (dir: 'left' | 'right' = 'right') => {
  if (!diplomasRow.value) return
  const step = 360
  diplomasRow.value.scrollBy({
    left: dir === 'right' ? step : -step,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section class="bg-white py-16 px-6">
    <div class="max-w-6xl mx-auto">
      <!-- TOP: Фото + цитата -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="flex justify-center">
          <div class="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full overflow-hidden bg-[#F5F1EA]">
            <img :src="hero" alt="Неля Тройчук" class="w-full h-full object-cover" />
          </div>
        </div>

        <div>
          <h1 class="text-4xl lg:text-5xl font-serif font-bold text-[#2A2A2A] mb-6">
            Про мене
          </h1>

          <div class="rounded-2xl border border-[#F5F1EA] bg-[#F7F4EE] p-6">
            <p class="text-[#2A2A2A] leading-relaxed">
              “Я вірю, що глибина любові визначає глибину болю. Якщо ви любили свою тварину як члена родини, ваш розпач не може бути “занадто великим”.
              Я не вчу забувати – я вчу інтегрувати цю втрату у ваше подальше життя так, щоб вона стала не тягарем, а світлою частиною вашої історії”
            </p>
            <p class="mt-4 font-medium text-[#2A2A2A]">
              Неля Тройчук
            </p>
          </div>

          <div class="mt-8 flex flex-wrap gap-4">
            <RouterLink
              to="/book"
              class="inline-flex items-center px-6 py-3 border-2 rounded-full border-[#F5F1EA] bg-[#E7E1D7]
                     text-[#2A2A2A] font-medium hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
            >
              Записатися на консультацію
            </RouterLink>

            <RouterLink
              to="/articles"
              class="inline-flex items-center px-6 py-3 border-2 rounded-full border-[#F5F1EA] bg-[#E7E1D7]
                    text-[#2A2A2A] font-medium hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
            >
              Почитати статті
            </RouterLink>

          </div>
        </div>
      </div>

      <!-- Who: титул + позиционирование -->
      <div class="mt-16 max-w-4xl mx-auto">
        <h2 class="text-2xl lg:text-3xl font-serif font-bold text-[#2A2A2A] mb-4 text-center">
          Психологиня • Дослідниця • Засновниця ГО
        </h2>

        <p class="text-[#2A2A2A]/80 leading-relaxed text-center">
          <span class="font-medium text-[#2A2A2A]">Неля Тройчук</span> – Психологиня | Дослідниця |
          Засновниця ГО «Психосоціальне Благополуччя і Захист» | Новаторка напрямку підтримки при втраті тварини
        </p>

        <div class="mt-8 rounded-2xl border border-[#F5F1EA] p-8 bg-white">
          <p class="text-[#2A2A2A]/80 leading-relaxed">
            Я повертаю право на біль тим, кого не чує суспільство. Ваші почуття справжні. Ваш біль важливий. Я допоможу знайти опору.
          </p>

          <p class="mt-4 text-[#2A2A2A]/80 leading-relaxed">
            У нашій культурі прийнято ділити втрати на «важливі» та «дрібниці». Я тут, щоб змінити це.
            Моя робота базується на науковому підході до «безправного горя» – станів, коли вам соромно плакати через смерть собаки,
            розрив дружби чи втрату звичного життя.
          </p>
        </div>
      </div>

      <!-- Experience: таймлайн -->
      <div class="mt-16 max-w-4xl mx-auto">
        <h2 class="text-2xl lg:text-3xl font-serif font-bold text-[#2A2A2A] mb-6">
          Мій досвід — це не лише дипломи
        </h2>

        <div class="space-y-4">
          <div class="rounded-2xl border border-[#F5F1EA] p-6 bg-white">
            <p class="text-[#2A2A2A]/85 leading-relaxed">
              <span class="font-semibold text-[#2A2A2A]">2014</span> — Професійний шлях розпочався у 2014 році — у часи перших великих потрясінь для нашої України.
              Понад десятиліття я допомагаю людям знаходити опору в умовах невизначеності, працюючи з панічними атаками, тривожними станами,
              домашнім насильством, депресією та складними процесами адаптації.
            </p>
          </div>

          <div class="rounded-2xl border border-[#F5F1EA] p-6 bg-white">
            <p class="text-[#2A2A2A]/85 leading-relaxed">
              <span class="font-semibold text-[#2A2A2A]">2022</span> — З 2022 року мій фокус зосередився на психології втрати.
              Пройшовши через власний досвід ВПО, двічі переживши втрату дому та вимушену міграцію, я присвятила свою діяльність підтримці тих,
              чий біль часто залишається непоміченим суспільством.
            </p>
          </div>

          <div class="rounded-2xl border border-[#F5F1EA] p-6 bg-white">
            <p class="text-[#2A2A2A]/85 leading-relaxed">
              Моя робота базується на науковому підході до <span class="font-medium text-[#2A2A2A]">Disenfranchised grief (безправного горя)</span> —
              станів, які не мають офіційного «статусу» в соціумі, але ранять не менш глибоко.
            </p>

            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="px-4 py-3 rounded-2xl bg-[#F7F4EE] border border-[#F5F1EA] text-[#2A2A2A]">
                втрата дружби та соціальних зв’язків
              </div>
              <div class="px-4 py-3 rounded-2xl bg-[#F7F4EE] border border-[#F5F1EA] text-[#2A2A2A]">
                розлучення та розрив стосунків
              </div>
              <div class="px-4 py-3 rounded-2xl bg-[#F7F4EE] border border-[#F5F1EA] text-[#2A2A2A]">
                втрата ідентичності та здоров’я
              </div>
              <div class="px-4 py-3 rounded-2xl bg-[#F7F4EE] border border-[#F5F1EA] text-[#2A2A2A]">
                втрата домашніх улюбленців (собак, котів, службових тварин)
              </div>
            </div>

            <p class="mt-5 text-[#2A2A2A]/85 leading-relaxed">
              І повертаю право на біль тим, кого не чують. Ваші почуття справжні. Ваш біль важливий. Я допоможу знайти нові опори.
            </p>
          </div>
        </div>
      </div>

      <!-- Education: safety -->
      <div class="mt-16 max-w-4xl mx-auto">
        <div class="rounded-2xl border border-[#F5F1EA] p-8 bg-white">
          <h2 class="text-2xl lg:text-3xl font-serif font-bold text-[#2A2A2A] mb-4">
            Моя освіта – це ваша безпека
          </h2>
          <p class="text-[#2A2A2A]/85 leading-relaxed">
            Кожна наукова робота, стаття чи сертифікат – це не просто підтвердження мого досвіду, а гарантія того, що ваша історія буде почута
            у професійному, безпечному та етичному просторі. Я використовую лише перевірені світові протоколи, щоб шлях до вашого зцілення був дбайливим.
          </p>
        </div>
      </div>

      <!-- Diplomas: горизонтальный скролл -->
      <div class="mt-16 max-w-6xl mx-auto">
        <div class="flex items-end justify-between gap-6 mb-6">
          <h2 class="text-2xl lg:text-3xl font-serif font-bold text-[#2A2A2A]">
            ДИПЛОМИ ТА СЕРТИФIКАТИ
          </h2>
          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-full
                  border border-[#F5F1EA] bg-[#E7E1D7] text-[#2A2A2A]
                  hover:bg-[#2A2A2A] hover:text-[#E7E1D7]
                  transition-colors"
            @click="scrollDiplomas('right')"
          >
            →
          </button>

        </div>
        <div ref="diplomasRow" class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          <div
            v-for="(d, i) in diplomas"
            :key="i"
            class="snap-start shrink-0 w-[260px] sm:w-[320px]"
          >
            <div class="rounded-2xl border border-[#F5F1EA] overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <img :src="d.src" :alt="d.alt" class="w-full h-[220px] object-cover" />
              <div class="p-4">
                <p class="text-sm font-medium text-[#2A2A2A]">{{ d.alt }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center">
          <RouterLink
            to="/book"
            class="inline-flex items-center px-7 py-3 border-2 rounded-full border-[#F5F1EA] bg-[#E7E1D7]
                   text-[#2A2A2A] font-medium hover:bg-[#2A2A2A] hover:text-[#E7E1D7] transition-colors"
          >
            Записатися
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
