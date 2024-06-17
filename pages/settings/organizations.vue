<script setup lang="ts">
import type { Classe, Organization } from '~/types'

let organizationResults = ref<Organization[] | []>([]);
const isNewOrganizationModalOpen = ref(false)
const actionToSubmit = ref('Add')
const isNewClasseModalOpen = ref(false)
const selectedTab = ref(0)
const selectedClasse = ref<Classe | null>(null)
const selectedOrganization = ref<Organization | null>(null)

const { data: classes, refresh } = await useFetch<Classe[]>('http://127.0.0.1:4000/classes', { default: () => [] })

// Filter classes based on the selected tab
const filteredClasses = computed(() => {
    if (selectedTab.value === 1) {
        return classes.value.filter(mail => !!mail.unread)
    }

    return classes.value
})

const organizationColumns = [
    {
        key: 'code',
        label: 'Code',
        sortable: true
    }, {
        key: 'description',
        label: 'Description'
    }, {
        key: 'actions',
        label: 'Actions'
    }]

async function editOrganization(row: Organization) {
    actionToSubmit.value = 'Update'
    selectedOrganization.value = row
    actionToSubmit.value = 'Add'
    isNewOrganizationModalOpen.value = true
}

async function deleteOrganization(organization: Organization) {
    const toast = useToast()
    try {
        const response = await $fetch<Organization | object>('http://127.0.0.1:4000/organizations/' + organization.id, { method: 'DELETE' })
        console.log({ response });
        toast.add({ title: 'Delete organization ' + organization.name, description: `${response}`, timeout: 5000 })
        setTimeout(() => {
            // isLoadingBtn.value = false
        }, 1000);
    } catch (error) {
        console.log('Error', error);
        // isLoadingBtn.value = false
    }
}

const items = (row: Organization) => [
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => editOrganization(row)
    }], [{
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => deleteOrganization(row)
    }]
]
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

function modalClasseClosed() {
    isNewClasseModalOpen.value = false;
    refresh();
    fetchOrganization(selectedClasse.value.id)
}

function modalOrganizationClosed() {
    isNewOrganizationModalOpen.value = false;
    fetchOrganization(selectedClasse.value.id)
}

async function fetchOrganization(id: string = 'default') {
    try {
        organizationResults.value = await $fetch<Organization[]>('http://127.0.0.1:4000/organization/byclasse', { method: 'GET', params: { classe_id: id } })
        // organizationResults.value = data.value
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
    selectedOrganization.value = null
    fetchOrganization(selectedClasse.value.id).then(() => console.log('Organization fetched executed %s', selectedClasse.value.id));
})

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
            <UDashboardNavbar title="Classes" :badge="filteredClasses.length">
                <template #right>
                    <UButton icon="i-heroicons-plus-16-solid" color="teal" variant="ghost"
                        @click="isNewClasseModalOpen = true" />
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
                        <UTooltip text="Move to junk">
                            <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost"
                                @click="fetchOrganization(selectedClasse.id)" />
                        </UTooltip>
                    </template>

                    <template #right>
                        <UButton icon="i-heroicons-plus-16-solid" label="Ajouter" color="teal" variant="solid"
                            @click="isNewOrganizationModalOpen = true" />
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
                            Organization
                        </h2>
                    </template>

                    <UTable :rows="organizationResults" :columns="organizationColumns"
                        class="m-2 border border-separate rounded-md">
                        <template #actions-data="{ row }">
                            <UDropdown :items="items(row)">
                                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                            </UDropdown>
                        </template>
                    </UTable>
                    <!-- <template #footer>
                        classe id {{ selectedClasse.id }}
                    </template> -->
                </UCard>
            </template>
            <div v-else class="flex-1 hidden lg:flex items-center justify-center">
                <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
            </div>
        </UDashboardPanel>
        <UDashboardModal v-model="isNewOrganizationModalOpen" :title="`${actionToSubmit} un Organization`"
            :description="`${actionToSubmit} un organization de la classe ${selectedClasse?.code}`"
            :ui="{ width: 'sm:max-w-md' }">
            <!-- ~/components/users/UsersForm.vue -->
            <ClassesOrganizationForm :classe="selectedClasse" :action='actionToSubmit' :organization="selectedOrganization"
                @close="modalOrganizationClosed" />
        </UDashboardModal>
        <UDashboardModal v-model="isNewClasseModalOpen" title="Ajouter une classe" description="Ajouter une classe"
            :ui="{ width: 'sm:max-w-md' }">
            <!-- ~/components/users/UsersForm.vue -->
            <ClassesForm @close="modalClasseClosed" />
        </UDashboardModal>
    </UDashboardPage>
</template>
