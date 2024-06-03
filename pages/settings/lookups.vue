<script setup lang="ts">
import type { Classe, Lookups } from '~/types'

const tabItems = [{
    label: 'All'
}, {
    label: 'Unread'
}]
const selectedTab = ref(0)
// const runtimeConfig = useRuntimeConfig()
const dropdownItems = [[{
    label: 'Mark as unread',
    icon: 'i-heroicons-check-circle'
}, {
    label: 'Mark as important',
    icon: 'i-heroicons-exclamation-circle'
}], [{
    label: 'Star thread',
    icon: 'i-heroicons-star'
}, {
    label: 'Mute thread',
    icon: 'i-heroicons-pause-circle'
}]]

const { data: classes } = await useFetch<Classe[]>('http://127.0.0.1:4000/classes', { default: () => [] })
const { data: lookupsResults } = await useFetch<Lookups[]>('http://127.0.0.1:4000/lookups/' + selectedTab.value, { default: () => [] })

// Filter classes based on the selected tab
const filteredClasses = computed(() => {
    if (selectedTab.value === 1) {
        return classes.value.filter(mail => !!mail.unread)
    }

    return classes.value
})

const selectedClasse = ref<Classe | null>()
const lookupsColumns = [{
    key: 'id',
    label: 'ID'
}, {
    key: 'code',
    label: 'Code'
}, {
    key: 'description',
    label: 'Description'
}, {
    key: 'classe_id',
    label: 'Classe'
}, {
    key: 'role'
}]
const isMailPanelOpen = computed({
    get() {
        return !!selectedClasse.value
    },
    set(value: boolean) {
        if (!value) {
            selectedClasse.value = null
        }
    }
})

// Reset selected mail if it's not in the filtered mails
watch(filteredClasses, () => {
    if (!filteredClasses.value.find(mail => mail.id === selectedClasse.value?.id)) {
        selectedClasse.value = null
    }
})
</script>

<template>
    <UDashboardPage>
        <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
            <UDashboardNavbar title="Classes" :badge="filteredClasses.length">
                <template #right>
                    <UTabs v-model="selectedTab" :items="tabItems"
                        :ui="{ wrapper: '', list: { height: 'h-9', tab: { height: 'h-7', size: 'text-[13px]' } } }" />
                </template>
            </UDashboardNavbar>
            <ClassesList v-model="selectedClasse" :classes="filteredClasses" />
        </UDashboardPanel>

        <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">
            <template v-if="selectedClasse">
                <UDashboardNavbar>
                    <template #toggle>
                        <UDashboardNavbarToggle icon="i-heroicons-x-mark" />

                        <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
                    </template>

                    <template #left>
                        <UTooltip text="Archive">
                            <UButton icon="i-heroicons-archive-box" color="gray" variant="ghost" />
                        </UTooltip>

                        <UTooltip text="Move to junk">
                            <UButton icon="i-heroicons-archive-box-x-mark" color="gray" variant="ghost" />
                        </UTooltip>

                        <UDivider orientation="vertical" class="mx-1.5" />

                        <UPopover :popper="{ placement: 'bottom-start' }">
                            <template #default="{ open }">
                                <UTooltip text="Snooze" :prevent="open">
                                    <UButton icon="i-heroicons-clock" color="gray" variant="ghost"
                                        :class="[open && 'bg-gray-50 dark:bg-gray-800']" />
                                </UTooltip>
                            </template>

                            <template #panel="{ close }">
                                <DatePicker @close="close" />
                            </template>
                        </UPopover>
                    </template>

                    <template #right>
                        <UTooltip text="Reply">
                            <UButton icon="i-heroicons-arrow-uturn-left" color="gray" variant="ghost" />
                        </UTooltip>

                        <UTooltip text="Forward">
                            <UButton icon="i-heroicons-arrow-uturn-right" color="gray" variant="ghost" />
                        </UTooltip>

                        <UDivider orientation="vertical" class="mx-1.5" />

                        <UDropdown :items="dropdownItems">
                            <UButton icon="i-heroicons-ellipsis-vertical" color="gray" variant="ghost" />
                        </UDropdown>
                    </template>
                </UDashboardNavbar>

                <!-- <ClassesMail :classe="selectedClasse" /> -->
                <UTable :rows="lookupsResults" :columns="lookupsColumns" />
            </template>
            <div v-else class="flex-1 hidden lg:flex items-center justify-center">
                <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
            </div>
        </UDashboardPanel>
    </UDashboardPage>
</template>