<script setup lang="ts">
import ABC from '~/components/MyImportComponent.vue';

const { $dialog } = useNuxtApp();

const com = computed(() => '');

const call = $fetch('/api/myapi');
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <MyComponent></MyComponent>
    <my-component></my-component>
    <ABC></ABC>
    <Head></Head>
    <NuxtWelcome />

    <Folder></Folder>
    <FolderMyCode></FolderMyCode>
  </div>
</template>
