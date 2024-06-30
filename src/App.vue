<template>
  <div id="app">
    <AppSidebar />
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppSidebar from '@/components/AppSidebar.vue';

export default {
  name: 'App',
  components: {
    AppSidebar,
  },
};
</script>

<style>
#app {
  display: flex;
}
.main {
  flex: 1;
  padding: 20px;
  background-color: #f0f8ff;
  width: 75rem;
}
</style>
