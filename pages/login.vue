<template>
    <UCard class="max-w-md w-full m-auto">
        <UAuthForm title="Login" description="Enter your credentials to access your account." align="bottom"
            icon="i-heroicons-user-circle"
            :fields="[
                { type: 'email', label: 'Email', placeholder: 'Enter your email', name: 'Email' },
                { type: 'password', label: 'Password', placeholder: 'Enter your password', name: 'Password' }]"
            :providers="[{ label: 'GitHub', icon: 'i-simple-icons-github', color: 'gray' }]" :loading="false" />
    </UCard>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})
</script>

<style scoped></style>
