<template>
  <footer class="footer">
    <div class="footer__inner">
      <div>
        <strong>{{ profile.name }}</strong>
        <span> — {{ tr(profile.roleTitle) }}</span>
      </div>
      <div class="footer__links">
        <a :href="profile.github" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a v-if="profile.linkedin" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <span>© {{ year }}</span>
      </div>
    </div>
    <p class="footer__credit">{{ tr(ui.footer.credit) }}</p>
  </footer>
</template>

<script setup>
import { profile } from '../data/profile'
import { useLocale } from '../composables/useLocale'
import { ui } from '../composables/i18n/ui'

const { tr } = useLocale()
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  padding: 40px 24px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

.footer__inner {
  max-width: var(--section-max);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--ink-2);
}

.footer__links {
  display: flex;
  gap: 18px;
}

.footer__links a:hover {
  color: var(--ink-0);
}

.footer__credit {
  margin-top: 20px;
  font-size: 0.75rem;
  color: var(--ink-2);
  opacity: 0.6;
}
</style>
