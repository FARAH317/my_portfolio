<template>
  <section id="projects" class="section projects">
    <SectionTitle
      :eyebrow="tr(ui.projects.eyebrow)"
      :title="tr(ui.projects.title)"
      :subtitle="tr(ui.projects.subtitle)"
    />

    <div class="projects__list">
      <ProjectCard
        v-for="(project, i) in projects"
        :key="project.id"
        :project="project"
        :reverse="i % 2 === 1"
      />
    </div>
  </section>
</template>

<script setup>
import SectionTitle from '../common/SectionTitle.vue'
import ProjectCard from './ProjectCard.vue'
import { projects } from '../../data/projects'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { tr } = useLocale()
</script>

<style scoped>
.projects__list {
  display: flex;
  flex-direction: column;
}
</style>
