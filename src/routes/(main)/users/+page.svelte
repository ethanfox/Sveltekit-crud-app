<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import Plus from 'lucide-svelte/icons/plus';
	import CreateUserForm from './components/create-user-form.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let createUserForm: any;

	let showDialog = $state(false);

	function handleFormSubmitted() {
		console.log('Form submitted');
		showDialog = false;
	}
</script>

<div class=" mt-8 flex flex-col">
	<div class="space-y-6 rounded-md border p-4">
		<div class="mb-4 flex w-full justify-between">
			<h1 class="text-2xl font-semibold">Users</h1>

			<AlertDialog.Root bind:open={showDialog}>
				<AlertDialog.Trigger>
					<Button>
						<Plus class="mr-2 h-4 w-4" />
						Create User
					</Button>
				</AlertDialog.Trigger>

				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Create User</AlertDialog.Title>
						<AlertDialog.Description>Enter a name for the new user.</AlertDialog.Description>
					</AlertDialog.Header>
					<CreateUserForm
						bind:this={createUserForm}
						data={data.createUserForm}
						onSubmitSuccess={handleFormSubmitted}
					/>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">ID</Table.Head>
					<Table.Head>Name</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.users as user (user.id)}
					<Table.Row on:click={() => goto(`/user/${user.id}`)}>
						<Table.Cell class="font-medium">{user.id}</Table.Cell>
						<Table.Cell>{user.name}</Table.Cell>
						<div class="flex w-full justify-end py-2 pr-2">
							<Button variant="secondary" class="my-auto">Manage</Button>
						</div>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
