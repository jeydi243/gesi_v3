<script setup lang="ts">
// import { format, isToday } from 'date-fns'
import type { Organization } from '~/types'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Organization | null>,
    default: null
  },
  organizations: {
    type: Array as PropType<Organization[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const mailsRefs = ref<Element[]>([])

const selectedOrganization = computed({
  get() {
    return props.modelValue
  },
  set(value: Organization | null) {
    emit('update:modelValue', value)
  }
})

watch(selectedOrganization, () => {
  if (!selectedOrganization.value) {
    return
  }
  console.log(selectedOrganization.value)

  const ref = mailsRefs.value[selectedOrganization.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.organizations.findIndex(mail => mail.id === selectedOrganization.value?.id)

    if (index === -1) {
      selectedOrganization.value = props.organizations[0]
    } else if (index < props.organizations.length - 1) {
      selectedOrganization.value = props.organizations[index + 1]
    }
  },
  arrowup: () => {
    const index = props.organizations.findIndex(mail => mail.id === selectedOrganization.value?.id)

    if (index === -1) {
      selectedOrganization.value = props.organizations[props.organizations.length - 1]
    } else if (index > 0) {
      selectedOrganization.value = props.organizations[index - 1]
    }
  }
})

</script>

<template>
  <UDashboardPanelContent class="p-0">
    <div v-for="(organization, index) in organizations" :key="index" :ref="el => { mailsRefs[organization.id] = el as Element }">
      <div class="p-4 text-sm cursor-pointer border-l-2" :class="[selectedOrganization && selectedOrganization.id === organization.id ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25' : 'border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'
      ]" @click="selectedOrganization = organization">
        <!-- <div class="flex items-center justify-between" :class="[organization.unread && 'font-semibold']">
          <div class="flex items-center gap-3">
            {{ organization.name }}

            <UChip v-if="organization.unread" />
          </div>

          <span>{{ isToday(new Date(organization.date)) ? format(new Date(organization.date), 'HH:mm') : format(new
            Date(organization.date), 'dd MMM') }}</span>
        </div> -->
        <p class="text-gray-400 dark:text-white line-clamp-1 font-extrabold">
          {{ organization.name }}
        </p>
        <p>
          {{ organization.code }}
        </p>
      </div>

      <UDivider />
    </div>
  </UDashboardPanelContent>
</template>
