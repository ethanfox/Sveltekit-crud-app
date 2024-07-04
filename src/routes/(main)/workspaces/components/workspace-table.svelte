<script lang="ts">
	import { enhance } from '$app/forms';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import Trash from 'lucide-svelte/icons/trash-2';
	import AddUserToWorkspaceForm from './add-user-to-workspace-form.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	export let data;
	let showAddToWorkSpaceAlert = false;
	let showDeleteAlert = false;
	let currentWorkspaceId = '';

	function handleAddtoWorkspaceFormSubmit() {
		console.log('success');
		showAddToWorkSpaceAlert = false;
	}
	console.log('data', data);

	function openDeleteAlert(workspaceId: string) {
		currentWorkspaceId = workspaceId;
		showDeleteAlert = true;
	}

	function openAddToWorkspaceAlert(workspaceId: string) {
		currentWorkspaceId = workspaceId;
		showAddToWorkSpaceAlert = true;
	}
</script>

<div>
	{#if data.workspaces.length === 0}
		<p class="text-slate">No workspaces found.</p>
	{:else}
		<ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
			{#each data.workspaces as workspace (workspace.id)}
				<li class="col-span-1 flex w-full rounded-md shadow-sm">
					<a class="flex w-full" href="/workspace/{workspace.id}">
						<div
							class="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
							style="background-color: {workspace.color};"
						></div>
						<div
							class="flex flex-1 items-center justify-between border-b border-t border-slate-700 transition-all hover:bg-slate-900/80"
						>
							<div class="flex-1 px-4 py-2 text-sm">
								<p class="font-medium transition-all hover:text-slate-600">{workspace.name}</p>

								<p class="text-slate-500">{workspace._count?.users ?? 0} Members</p>
							</div>
						</div>
					</a>

					<div class="flex flex-shrink-0 rounded-r-md border-b border-r border-t border-slate-700">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button
									class="my-auto h-full w-full rounded-l-none rounded-r-md"
									builders={[builder]}
									variant="ghost"
									><svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path
											d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
										/>
									</svg></Button
								>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56">
								<DropdownMenu.Label>Quick Actions</DropdownMenu.Label>
								<DropdownMenu.Separator />

								<DropdownMenu.Item on:click={() => openAddToWorkspaceAlert(workspace.id)}>
									<CirclePlus class="mr-2 h-4 w-4" />
									<span>Add User</span>
								</DropdownMenu.Item>
								<DropdownMenu.Item on:click={() => openDeleteAlert(workspace.id)}>
									<Trash class="mr-2 h-4 w-4" />
									<span>Delete Workspace</span>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<AlertDialog.Root bind:open={showDeleteAlert}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Workspace</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this workspace? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deleteWorkspace" id="deleteWorkspace" use:enhance>
			<input type="hidden" name="workspaceId" value={currentWorkspaceId} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:click={() => (showDeleteAlert = false)}>Cancel</AlertDialog.Cancel>
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
			workspaceId={currentWorkspaceId}
			users={data.users}
			onSubmitSuccess={handleAddtoWorkspaceFormSubmit}
		/>
	</AlertDialog.Content>
</AlertDialog.Root>
