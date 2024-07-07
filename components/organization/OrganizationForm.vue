<script setup lang="ts">
import { format } from 'date-fns'
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { Lookups, Organization } from '~/types'

const emit = defineEmits(['close'])
let props = defineProps({
  organizationParent: {
    type: Object as PropType<Organization>,
    required: false,
    default: null
  },
  action: {
    type: String,
    required: true,
    default: "Add"
  },
  organization: {
    type: Object as PropType<Organization>,
    required: false,
    default: null
  }
})
const isLoadingBtn = ref(false)
const isLoadingLookup = ref(false)
const state = reactive({
  id: null,
  name: undefined,
  code: undefined,
  description: undefined,
  lookup_id: null,
  active_date: null,
  end_date: null,
  organization_parent_id: null
})

const date = ref(new Date())
let lookups = ref([])

async function getCategory() {
  try {
    const data = await $fetch<Lookups[]>('http://127.0.0.1:4000/lookups', { method: 'GET' })
    lookups.value = data.map((l) => {
      return { name: l.name, value: l.id }
    })
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getCategory()
  // if (props.organizationParent) {
  //   state.organization_parent_id = props.organizationParent.id
  // }
  if (props.organization) {
    state.id = props.organization.id
    state.code = props.organization.code
    state.name = props.organization?.name
    state.organization_parent_id = props.organizationParent?.id
    state.description = props.organization.description
  }
})

// onBeforeMount(() => {
//   if (props.org) {
//     state.id = props.org.id
//     state.code = props.org.code
//     state.name = props.org.name
//     state.organization_parent_id = props.organizationParent.id
//     state.description = props.org.description
//   }
// })

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
  if (!state.code) errors.push({ path: 'code', message: 'Please enter a code.' })
  if (!state.lookup_id) errors.push({ path: 'lookup_id', message: 'Please enter a organization category.' })
  if (!state.active_date) errors.push({ path: 'active_date', message: 'Please enter a organization active date.' })
  if (!state.description) errors.push({ path: 'description', message: 'Please enter an description.' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
  isLoadingBtn.value = true
  console.log(event.data)
  let response = null;
  // send new classe
  try {
    if (props.action !== 'Add') {
      response = await $fetch<Organization>('http://127.0.0.1:4000/organizations', { method: 'PATCH', body: event.data })
    } else {
      response = await $fetch<Organization>('http://127.0.0.1:4000/organizations', { method: 'POST', body: event.data })
    }
    console.dir(response)
    console.log(`${props.action} a organization with name ${event.data?.name}.response =  ${JSON.stringify(response)}`);
    isLoadingBtn.value = false
    emit('close')
  } catch (error) {
    console.log('Error', error);
    isLoadingBtn.value = false
  }
}

</script>

<template>
  <UForm :validate="validate" :validate-on="['submit']" :state="state" class="space-y-4" @submit="onSubmit">
    The parent id is {{ props.organizationParent?.id }} est egale a {{ state.organization_parent_id }}
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" placeholder="Gecamines" autofocus />
    </UFormGroup>

    <UFormGroup label="Code" name="code">
      <UInput v-model="state.code" placeholder="Gcm" />
    </UFormGroup>

    <UFormGroup label="Category" name="lookup_id">
      <USelect v-model="state.lookup_id" :options="lookups" option-attribute="name" :loading="isLoadingLookup"
        placeholder="Org category" />
    </UFormGroup>

    <UFormGroup label="Active Date" name="active_date">
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton icon="i-heroicons-calendar-days-20-solid"
          :label="format(state.active_date ? state.active_date : date, 'd MMM, yyy')" />

        <template #panel="{ close }">
          <DatePicker v-model="state.active_date" is-required @close="close" />
        </template>
      </UPopover>
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <!-- <UInput v-model="state.description" type="email" placeholder="john.doe@example.com" /> -->
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton label="Cancel" color="gray" variant="ghost" @click="emit('close')" />
      <UButton type="submit" :label="props.action" color="black" :loading='isLoadingBtn' />
    </div>
  </UForm>
</template>
