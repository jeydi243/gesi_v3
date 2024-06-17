<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { Organization } from '~/types'

defineProps({
  organization: {
    type: Object as PropType<Organization>,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <UDashboardPanelContent>
    <div class="flex justify-between">
      <div class="flex items-center gap-4">
        <UAvatar :alt="organization.name" size="lg" />

        <div class="min-w-0">
          <p class="text-gray-900 dark:text-white font-semibold">
            {{ organization.description }}
          </p>
          <p class="text-gray-500 dark:text-gray-400 font-medium">
            {{ organization?.code }}
          </p>
        </div>
      </div>

      <p class="font-medium text-gray-900 dark:text-white">
        {{ isToday(new Date(organization.created)) ? format(new Date(organization.created), 'HH:mm') : format(new
          Date(organization.created), 'dd MMM') }}
      </p>
    </div>

    <UDivider class="my-5" />

    <div class="flex-1">
      <p class="text-lg">
        {{ organization.description }}
      </p>
    </div>

    <UDivider class="my-5" />

    <form @submit.prevent>
      <UTextarea color="gray" required size="xl" :rows="5" :placeholder="`Reply to ${organization.name}`">
        <UButton type="submit" color="black" label="Send" icon="i-heroicons-paper-airplane"
          class="absolute bottom-2.5 right-3.5" />
      </UTextarea>
    </form>
  </UDashboardPanelContent>
</template>
