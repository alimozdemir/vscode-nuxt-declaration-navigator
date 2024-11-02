<script lang="ts" setup>
const call = $fetch('/api/myapi');

const call2 = $fetch('/api/mytest');

const call3 = $fetch('/api/mytest', {
    method: 'POST',
    body: JSON.stringify({ name: 'test' }),
});

const call4 = $fetch(
    '/api/mytest', {
    method: 'POST',
    body: JSON.stringify({ name: 'test' }),
});

const call5 = useFetch('/api/myapi')
</script>

<template>

</template>