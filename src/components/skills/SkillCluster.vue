<template>
  <button
    type="button"
    class="glass glow-border rounded-2xl p-5 text-left w-full transition-all duration-300"
    :class="active ? 'ring-1' : 'hover:-translate-y-1'"
    :style="active ? { boxShadow: `0 0 0 1px ${cluster.color}55, 0 12px 30px rgba(0,0,0,0.4)` } : {}"
    @click="$emit('toggle')"
  >
    <div class="flex items-center justify-between">
      <span class="font-display text-base text-white font-medium">{{ cluster.label }}</span>
      <span class="w-2.5 h-2.5 rounded-full" :style="{ background: cluster.color }"></span>
    </div>
    <p class="mt-1 text-xs text-white/40">{{ cluster.items.length }} technologies</p>

    <transition name="expand">
      <ul v-if="active" class="mt-4 space-y-2 overflow-hidden">
        <li
          v-for="item in cluster.items"
          :key="item.name"
          class="flex items-center justify-between text-sm text-white/70 border-t border-white/5 pt-2 first:border-t-0 first:pt-0"
        >
          <span>{{ item.name }}</span>
          <span class="text-xs text-white/40">{{ item.level }}</span>
        </li>
      </ul>
    </transition>
  </button>
</template>

<script setup>
defineProps({
  cluster: { type: Object, required: true },
  active: { type: Boolean, default: false },
})
defineEmits(['toggle'])
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.35s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 400px; }
</style>
