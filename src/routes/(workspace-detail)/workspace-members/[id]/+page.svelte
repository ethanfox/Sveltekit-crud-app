<script lang="ts">
	import Plus from 'lucide-svelte/icons/plus';
	import { enhance } from '$app/forms';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import AddUserToWorkspaceForm from './components/add-user-to-workspace-form.svelte';
	import {
		AlertDialog,
		AlertDialogFooter,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogContent,
		AlertDialogHeader,
		AlertDialogCancel,
		AlertDialogAction
	} from '$lib/components/ui/alert-dialog';
	import type { UserSchema } from '$lib/schemas';

	let { data } = $props();

	let selectedUser: UserSchema | null = null;
	console.log('DATA', data);

	let showRemoveAlert = $state(false);

	let showAddToWorkSpaceAlert = $state(false);
	function openAddToWorkspaceAlert() {
		showAddToWorkSpaceAlert = true;
	}    
	

	function handleRemoveClick(user: UserSchema) {
		console.log('Remove user', user);
		selectedUser = user;
		showRemoveAlert = true;
	}

	function handleAddtoWorkspaceFormSubmit() {
		console.log('success');
		showAddToWorkSpaceAlert = false;
	}
</script>

<div class=" mt-8 flex flex-col">
	<div class="space-y-6 rounded-md border p-4">
		<div class="mb-4 flex w-full justify-between">
			<h1 class="text-2xl font-semibold">Members</h1>

			<Button on:click={openAddToWorkspaceAlert}>
				<Plus class="mr-2 h-4 w-4" />
				<span>Add User</span>
			</Button>
		</div>

		{#if data.workspaceMembers?.users.length > 0 ?? false}
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">ID</Table.Head>
						<Table.Head>Members</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.workspaceMembers.users as user (user.userId)}
						<Table.Row>
							<Table.Cell class="font-medium">{user.user.id}</Table.Cell>
							<Table.Cell>{user.user.name}</Table.Cell>
							<div class="flex w-full justify-end py-2 pr-2">
								<Button
									on:click={() => handleRemoveClick(user.user)}
									variant="destructive"
									class="my-auto">Remove</Button
								>
							</div>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{:else}
			<p>This workspace has no members.</p>
		{/if}
	</div>
</div>

<AlertDialog bind:open={showRemoveAlert}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Remove from Workspace</AlertDialogTitle>
			<AlertDialogDescription>
				Are you sure you want to remove the user from this workspace?
			</AlertDialogDescription>
		</AlertDialogHeader>
		<form method="POST" action="?/removeUserFromWorkspace" id="removeUserFromWorkspace" use:enhance>
			<div class="mb-4 flex justify-between rounded-md border p-3">
				<p class=" font-semibold">{selectedUser?.name}</p>
				<p class="text-slate-600">ID: {selectedUser?.id}</p>
			</div>
			<input type="hidden" name="workspaceId" value={data.workspace?.id} />
			<input type="hidden" name="userId" value={selectedUser?.id ?? ''} />
			<AlertDialogFooter>
				<AlertDialogCancel on:click={() => (showRemoveAlert = false)}>Cancel</AlertDialogCancel>
				<AlertDialogAction class="bg-red-800 text-white" type="submit">Delete</AlertDialogAction>
			</AlertDialogFooter>
		</form>
	</AlertDialogContent>
</AlertDialog>

<AlertDialog bind:open={showAddToWorkSpaceAlert}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Add to Workspace</AlertDialogTitle>
		</AlertDialogHeader>
		<AddUserToWorkspaceForm
			data={data.addUsersForm}
			workspaceId={data.workspace?.id ?? ''}
			users={data.users}
			onSubmitSuccess={handleAddtoWorkspaceFormSubmit}
		/>
	</AlertDialogContent>
</AlertDialog>
