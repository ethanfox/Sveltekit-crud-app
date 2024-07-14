<script lang="ts">
	import Plus from 'lucide-svelte/icons/plus';
	import { enhance } from '$app/forms';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import AddUserToWorkspaceForm from './components/add-user-to-workspace-form.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { userSchema, type UserSchema } from '$lib/schemas';

	let { data } = $props();

	let selectedUser: UserSchema | null = $state(null);

	let showRemoveAlert = $state(false);

	let showAddToWorkSpaceAlert = $state(false);
	function openAddToWorkspaceAlert() {
		showAddToWorkSpaceAlert = true;
	}

	function handleRemoveClick(user: UserSchema) {
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

		{#if data.workspaceMembers && data.workspaceMembers?.users?.length > 0}
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

							<Table.Cell>
								<div class="flex w-full justify-end py-2 pr-2">
									<Button
										on:click={() => {
											const parsedUser = userSchema.safeParse(user.user);
											if (parsedUser.success) {
												handleRemoveClick(parsedUser.data);
											} else {
												console.error('Invalid user data:', user);
												console.error('Invalid user data:', parsedUser.error);
											}
										}}
										variant="destructive">Remove</Button
									>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{:else}
			<p>This workspace has no members.</p>
		{/if}
	</div>
</div>

<AlertDialog.Root bind:open={showRemoveAlert}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Remove from Workspace</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to remove the user from this workspace?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/removeUserFromWorkspace" id="removeUserFromWorkspace" use:enhance>
			<div class="mb-4 flex justify-between rounded-md border p-3">
				<p class=" font-semibold">{selectedUser?.name}</p>
				<p class="text-slate-600">ID: {selectedUser?.id}</p>
			</div>
			<input type="hidden" name="workspaceId" value={data.workspace?.id} />
			<input type="hidden" name="userId" value={selectedUser?.id ?? ''} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:click={() => (showRemoveAlert = false)}>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action class="bg-red-800 text-white" type="submit">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={showAddToWorkSpaceAlert}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Add to Workspace</AlertDialog.Title>
		</AlertDialog.Header>
		<AddUserToWorkspaceForm
			data={data.addUsersForm}
			workspaceId={data.workspace?.id ?? ''}
			users={data.users}
			onSubmitSuccess={handleAddtoWorkspaceFormSubmit}
		/>
	</AlertDialog.Content>
</AlertDialog.Root>
