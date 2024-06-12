<script setup lang="ts">
import type { Classe, Lookups } from '~/types'

const tabItems = [{
    label: 'All'
}, {
    label: 'Unread'
}]
let lookupsResults = ref<Lookups[] | []>([]);
const isNewUserModalOpen = ref(false)
const isNewClasseModalOpen = ref(false)
const selectedTab = ref(0)
const selectedClasse = ref<Classe | null>(null)

const { data: classes } = await useFetch<Classe[]>('http://127.0.0.1:4000/classes', { default: () => [] })

// Filter classes based on the selected tab
const filteredClasses = computed(() => {
    if (selectedTab.value === 1) {
        return classes.value.filter(mail => !!mail.unread)
    }

    return classes.value
})

const lookupsColumns = [
    {
        key: 'code',
        label: 'Code',
        sortable: true
    }, {
        key: 'description',
        label: 'Description'
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

async function fetchLookups(id: string = 'default') {
    try {
        lookupsResults.value = await $fetch<Lookups[]>('http://127.0.0.1:4000/lookups/byclasse', { method: 'GET', params: { classe_id: id } })
        // lookupsResults.value = data.value
    } catch (error) {
        console.log('Error', error);
    }
}

// Reset selected mail if it's not in the filtered mails
watch(filteredClasses, () => {
    if (!filteredClasses.value.find(mail => mail.id === selectedClasse.value?.id)) {
        selectedClasse.value = null
    }
})

watch(selectedClasse, () => {
    console.log('Selected class ID = %s', selectedClasse.value.id);
    fetchLookups(selectedClasse.value.id).then(() => console.log('Lookups fetched executed %s', selectedClasse.value.id));
})

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
            <UDashboardNavbar title="Classes" :badge="filteredClasses.length">
                <template #right>
                    <UButton icon="i-heroicons-plus-16-solid" color="teal" variant="ghost" @click="isNewClasseModalOpen = true" />
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
                        <UButton icon="i-heroicons-plus-16-solid" label="Ajouter" color="teal" variant="solid" @click="isNewUserModalOpen = true" />
                    </template>
                </UDashboardNavbar>

                <!-- <ClassesMail :classe="selectedClasse" /> -->
                <UCard :ui="{
                    base: 'm-2',
                    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                    header: {
                        base: '',
                        background: '',
                        padding: 'py-3 px-3'
                    }
                }">
                    <template #header>
                        Informations de la classe
                    </template>
                </UCard>
                <UCard :ui="{
                    base: 'm-2',
                    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                    header: {
                        base: '',
                        background: '',
                        padding: 'px-1'
                    },
                    body: {
                        base: '',
                        background: '',
                        padding: 'px-1'
                    }
                }">
                    <template #header>
                        <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                            Lookups
                        </h2>
                    </template>

                    <UTable :rows="lookupsResults" :columns="lookupsColumns"
                        class="m-2 border border-separate rounded-md" />

                    <template #footer>
                        classe id {{ selectedClasse.id }}
                    </template>
                </UCard>
            </template>
            <div v-else class="flex-1 hidden lg:flex items-center justify-center">
                <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
            </div>
        </UDashboardPanel>
        <UDashboardModal v-model="isNewUserModalOpen" title="Ajouter un Lookups"
            description="`Ajouter un lookups de la classe ${selectedClasse.code}`" :ui="{ width: 'sm:max-w-md' }">
            <!-- ~/components/users/UsersForm.vue -->
            <UsersForm @close="isNewUserModalOpen = false" />
        </UDashboardModal>
        <UDashboardModal v-model="isNewClasseModalOpen" title="Ajouter une classe"
            description="Ajouter une classe" :ui="{ width: 'sm:max-w-md' }">
            <!-- ~/components/users/UsersForm.vue -->
            <UsersForm @close="isNewClasseModalOpen = false" />
        </UDashboardModal>
    </UDashboardPage>
</template>
