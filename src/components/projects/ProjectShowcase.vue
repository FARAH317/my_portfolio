<template>
  <GlassCard class="p-8 md:p-10 grid md:grid-cols-2 gap-8 items-start" :hover="false">
    <div class="order-2 md:order-1">
      <div class="aspect-video rounded-xl bg-gradient-to-br from-accent-blue/20 via-accent-violet/10 to-transparent border border-white/10 flex items-center justify-center text-white/30 text-sm">
        Screenshot placeholder — drop into /public/projects/{{ project.slug }}/
      </div>
    </div>
    <div class="order-1 md:order-2">
      <p class="text-xs uppercase tracking-wider text-accent-cyan/80">Featured Project</p>
      <h3 class="mt-2 font-display text-3xl text-white font-semibold">{{ project.title }}</h3>
      <p class="mt-4 text-white/70 leading-relaxed">{{ project.description }}</p>
      <p class="mt-3 text-white/60 leading-relaxed text-sm">{{ project.contribution }}</p>

      <div class="mt-5 text-xs text-white/50 font-mono leading-relaxed">
        Frontend → REST API → Backend → Database
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <span v-for="tech in project.stack" :key="tech" class="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
          {{ tech }}
        </span>
      </div>

      <div class="mt-6 flex gap-4 text-sm">
        <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" class="px-5 py-2.5 rounded-full bg-white text-bg font-medium hover:bg-white/85 transition-colors">
          View code
        </a>
      </div>
    </div>
  </GlassCard>
</template>

<script setup>
defineProps({ project: { type: Object, required: true } })
import GlassCard from '../common/GlassCard.vue'
</script>
