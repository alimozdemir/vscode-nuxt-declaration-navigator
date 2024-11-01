<script setup lang="ts">
import MyImportComponent from '~/components/MyImportComponent.vue';

const { $dialog } = useNuxtApp();

const com = computed(() => '');
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <MyComponent></MyComponent>
    <my-component></my-component>
    <MyImportComponent></MyImportComponent>
    <Head></Head>
    <NuxtWelcome />
  </div>
</template>
