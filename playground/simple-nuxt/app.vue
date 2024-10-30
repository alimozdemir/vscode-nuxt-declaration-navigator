<script setup lang="ts">
const { $dialog } = useNuxtApp();

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <MyComponent></MyComponent>
    <Head></Head>
    <NuxtWelcome />
  </div>
</template>
