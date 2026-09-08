<template>
  <section id="contact" class="section contact">
    <div class="contact__inner">
      <div class="contact__intro">
        <span class="eyebrow">{{ tr(ui.contact.eyebrow) }}</span>
        <h2>{{ tr(ui.contact.heading) }}</h2>
        <p>
          {{ tr(ui.contact.intro) }}
        </p>

        <div class="contact__links">
          <button class="contact__email" @click="copyEmail">
            {{ copied ? tr(ui.contact.copied) : profile.email }}
          </button>
          <a :href="profile.github" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a v-if="profile.linkedin" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>

      <GlassCard class="contact__form-card">
        <form class="contact__form" @submit.prevent="handleSubmit">
          <label>
            {{ tr(ui.contact.formName) }}
            <input v-model="form.name" type="text" required :placeholder="tr(ui.contact.formNamePlaceholder)" />
          </label>
          <label>
            {{ tr(ui.contact.formEmail) }}
            <input v-model="form.email" type="email" required placeholder="vous@exemple.com" />
          </label>
          <label>
            {{ tr(ui.contact.formMessage) }}
            <textarea v-model="form.message" rows="4" required :placeholder="tr(ui.contact.formMessagePlaceholder)"></textarea>
          </label>
          <MagneticButton primary type="submit">
            {{ sent ? tr(ui.contact.sent) : tr(ui.contact.send) }}
          </MagneticButton>
        </form>
      </GlassCard>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import MagneticButton from '../common/MagneticButton.vue'
import { profile } from '../../data/profile'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { tr } = useLocale()

const form = reactive({ name: '', email: '', message: '' })
const sent = ref(false)
const copied = ref(false)

function handleSubmit() {
  // Aucun backend connecté : ouvre le client mail avec le message pré-rempli.
  const subject = encodeURIComponent(`Contact portfolio — ${form.name}`)
  const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  sent.value = true
  setTimeout(() => (sent.value = false), 3000)
}

function copyEmail() {
  navigator.clipboard?.writeText(profile.email)
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}
</script>

<style scoped>
.contact__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 860px) {
  .contact__inner {
    grid-template-columns: 1fr;
  }
}

.contact__intro h2 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  margin: 16px 0 20px;
}

.contact__links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 32px;
  font-size: 0.9rem;
}

.contact__email {
  background: none;
  border: none;
  color: var(--accent-blue);
  padding: 0;
  font-size: 0.9rem;
}

.contact__links a:hover {
  color: var(--ink-0);
}

.contact__form-card {
  padding: 34px;
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.contact__form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--ink-2);
}

.contact__form input,
.contact__form textarea {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 14px;
  color: var(--ink-0);
  font-family: var(--font-body);
  font-size: 0.92rem;
  resize: vertical;
}

.contact__form input:focus,
.contact__form textarea:focus {
  outline: none;
  border-color: var(--accent-blue);
}
</style>
