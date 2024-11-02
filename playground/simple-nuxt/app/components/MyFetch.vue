<script lang="ts" setup>
const call = $fetch('/api/myapi');

const call2 = $fetch('/api/mytest');

const call3 = useFetch('/api/myapi')

const call4 = $fetch('/api/change', {
    method: 'POST',
    body: JSON.stringify({ name: 'test' }),
})

const call5 = $fetch('/api/change', {
    method: 'GET',
    body: JSON.stringify({ name: 'test' }),
})

const call6 = $fetch('/api/change')
</script>

<template>

</template>