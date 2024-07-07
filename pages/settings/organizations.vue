<script setup lang="ts">
import type { Organization } from '~/types'

let organizationResults = ref<Organization[] | []>([]);
const isNewOrganizationModalOpen = ref(false)
const actionToSubmit = ref('Add')
const isNewOrgModalOpen = ref(false)
const isNewChildOrgModalOpen = ref(false)
const isLoadChildOrg = ref(false)
const selectedOrganization = ref<Organization | null>(null)
const selectedChildOrganization = ref<Organization | null>(null)

const { data: organizations, refresh } = await useFetch<Organization[]>('http://127.0.0.1:4000/organizations', { default: () => [] })

const organizationColumns = [
    {
        key: 'name',
        label: 'Name',
        sortable: true
    }, {
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
    selectedChildOrganization.value = row
    isNewChildOrgModalOpen.value = true
}
async function editOrganization2(row: Organization) {
    actionToSubmit.value = 'Update'
    selectedOrganization.value = row
    isNewOrgModalOpen.value = true
}

async function deleteOrganization(organization: Organization) {
    const toast = useToast()
    try {
        const response = await $fetch<Organization | object>('http://127.0.0.1:4000/organizations' + organization.id, { method: 'DELETE' })
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
        return !!selectedOrganization.value
    },
    set(value: boolean) {
        if (!value) {
            selectedOrganization.value = null
        }
    }
})

function modalOrganizationClosed() {
    isNewOrgModalOpen.value = false;
    isNewChildOrgModalOpen.value = false;
    refresh();
    if (selectedOrganization.value) {
        fetchOrganization(selectedOrganization.value?.id)
    }
}

async function fetchOrganization(id: string = 'default') {
    isLoadChildOrg.value = true;
    try {
        if (id != 'default') {
            const data = await $fetch<Organization[]>('http://127.0.0.1:4000/organizations/byparent', { method: 'GET', params: { organization_parent_id: id } })
            setTimeout(() => {
                organizationResults.value = data
                isLoadChildOrg.value = false
            }, 1000);
        } else {
            console.log("L'id du parent n'est pas fournis");
        }
        // organizationResults.value = data.value
    } catch (error) {
        console.log('Error in fetchOrganization : ', error);
    }
}

// Reset selected mail if it's not in the filtered mails
// watch(filteredOrganization, () => {
//     if (!filteredOrganization.value.find(mail => mail.id === selectedOrganization.value?.id)) {
//         selectedOrganization.value = null
//     }
// })

watch(selectedOrganization, () => {
    console.log('Selected organization ID = %s', selectedOrganization.value.id);
    fetchOrganization(selectedOrganization.value?.id).then(() => console.log('Organization fetched executed %s', selectedOrganization.value.id));
})

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
            <UDashboardNavbar title="Organizations" :badge="organizations?.length">
                <template #right>
                    <UButton icon="i-heroicons-plus-16-solid" color="teal" variant="ghost"
                        @click="isNewOrgModalOpen = true; selectedOrganization = null; actionToSubmit = 'Add'" />
                </template>
            </UDashboardNavbar>
            <OrganizationList v-model="selectedOrganization" :organizations="organizations" />
        </UDashboardPanel>

        <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">
            <template v-if="selectedOrganization">
                <UDashboardNavbar>
                    <template #toggle>
                        <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
                        <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
                    </template>

                    <template #left>
                        <UTooltip text="Refresh">
                            <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost"
                                @click="fetchOrganization(selectedOrganization.id)" />
                        </UTooltip>
                    </template>

                    <template #right>
                        <UButton icon="i-heroicons-plus-16-solid" label="Ajouter" color="teal" variant="solid"
                            @click="isNewChildOrgModalOpen = true; selectedChildOrganization = null; actionToSubmit = 'Add'" />
                    </template>
                </UDashboardNavbar>

                <UCard :ui="{
                    base: 'm-2',
                    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                    header: {
                        base: 'flex flex-col justify-between',
                        background: '',
                        padding: 'py-3 px-3'
                    }
                }">
                    <template #header>
                        <div class="flex flex-row justify-between">
                            <Placeholder height="10" width='10' />
                            {{ selectedOrganization.name }}
                            <UButton icon="i-heroicons-ellipsis-vertical-solid" color="gray" variant="ghost"
                                @click="editOrganization2(selectedOrganization)" />
                        </div>
                        <div class="grid grid-cols-4 gap-4">
                            <div class="flex flex-col">
                                <span class="font-extrabold text-teal-200">Name</span>
                                <span>{{ selectedOrganization.name }}</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="font-extrabold text-teal-200">Code</span>
                                <span>{{ selectedOrganization.code }}</span>
                            </div>
                            <div
                                class="flex flex-col hover:opacity-5 hover:transition-all hover:duration-700 rounded-md">
                                <span class="font-extrabold text-teal-200">Description</span>
                                <span>{{ selectedOrganization.description }}</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="font-extrabold text-teal-200">Category</span>
                                <span>{{ selectedOrganization.lookups_id }}</span>
                            </div>
                        </div>
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

                    <UTable :rows="organizationResults" :columns="organizationColumns" :loading='isLoadChildOrg'
                        class="m-2 border border-separate rounded-md">
                        <template #actions-data="{ row }">
                            <UDropdown :items="items(row)">
                                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                            </UDropdown>
                        </template>
                    </UTable>
                    <!-- <template #footer>
                        organization id {{ selectedOrganization.id }}
                    </template> -->
                </UCard>
            </template>
            <div v-else class="flex-1 hidden lg:flex items-center justify-center">
                <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
            </div>
        </UDashboardPanel>
        <UDashboardModal v-model="isNewOrgModalOpen" title="Organization" :description="`${actionToSubmit} oganization ${selectedOrganization?.name}`"
            :ui="{ width: 'sm:max-w-md' }">
            <OrganizationForm :action='actionToSubmit'
                :description="`${actionToSubmit} oganization ${selectedOrganization?.name}`"
                :organization="selectedOrganization"
                @close="modalOrganizationClosed" />
        </UDashboardModal>
        <UDashboardModal v-model="isNewChildOrgModalOpen" title="Organization"
            :description="`${actionToSubmit} ${selectedChildOrganization ? selectedChildOrganization.name : ''} oganization in ${selectedOrganization?.name}`"
            :ui="{ width: 'sm:max-w-md' }">
            <OrganizationForm :action='actionToSubmit' :organization="selectedChildOrganization"
                :organization-parent="selectedOrganization" @close="modalOrganizationClosed" />
        </UDashboardModal>
    </UDashboardPage>
</template>
