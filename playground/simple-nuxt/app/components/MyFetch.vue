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

const id = 1;

const call7 = $fetch(`/api/blog/` + id)

const call8 = $fetch('/api/blog/' + id)

const call9 = $fetch("/api/blog/" + id)

const call10 = $fetch(`/api/blog/${id}`)

const call11 = $fetch(`/api/blog/${id}/my-slug`)

const call12 = $fetch("/api/blog/" + id + '/new')
const call13 = $fetch("/api/blog/" + id + '/' + id)
</script>

<template>

</template>