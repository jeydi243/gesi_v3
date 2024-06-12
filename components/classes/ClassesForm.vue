<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { Classe } from '~/types'

const emit = defineEmits(['close'])

const state = reactive({
  code: undefined,
  description: undefined
})

// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.code) errors.push({ path: 'code', message: 'Please enter a code.' })
  if (!state.description) errors.push({ path: 'description', message: 'Please enter an description.' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)
  // send new classe
  try {
      await $fetch<Classe[]>('http://127.0.0.1:4000/classe', { method: 'POST', body: event.data })
  } catch (error) {
      console.log('Error', error);
  }

  emit('close')
}
</script>

<template>
  <UForm :validate="validate" :validate-on="['submit']" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" placeholder="John Doe" autofocus />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" type="email" placeholder="john.doe@example.com" />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton label="Cancel" color="gray" variant="ghost" @click="emit('close')" />
      <UButton type="submit" label="Save" color="black" />
    </div>
  </UForm>
</template>
