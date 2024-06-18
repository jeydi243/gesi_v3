<template>
    <UCard class="max-w-sm w-full h-full m-auto">
        <UAuthForm title="Login" description="Enter your credentials to access your account." align="bottom"
            icon="i-heroicons-user-circle"
            :fields="[{ type: 'email', label: 'Email', placeholder: 'Enter your email' }, { type: 'password', label: 'Password', placeholder: 'Enter your password', color: 'gray' }]"
            :providers="[{ label: 'GitHub', icon: 'i-simple-icons-github', color: 'gray' }]" :loading="false" />
    </UCard>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})
</script>

<style scoped></style>
