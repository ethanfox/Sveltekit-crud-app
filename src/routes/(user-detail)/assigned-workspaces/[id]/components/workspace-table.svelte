<script lang="ts">
	import { enhance } from '$app/forms';
	import Trash from 'lucide-svelte/icons/trash-2';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';

	export let data;

	let showDeleteAlert = false;
	let currentWorkspaceId = '';

	function openDeleteAlert(workspaceId: string) {
		currentWorkspaceId = workspaceId;
		showDeleteAlert = true;
	}
</script>

<div>
	{#if data.assignedWorkspaces.workspaces.length === 0}
		<p class="text-slate">No workspaces found.</p>
	{:else}
		<ul
			role="list"
			class="mt-3 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2"
		>
			{#each data.assignedWorkspaces.workspaces as workspace (workspace.workspaceId)}
				<li class="col-span-1 flex w-full rounded-md shadow-sm">
					<div
						class="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
						style="background-color: {workspace.workspace.color};"
					></div>
					<div
						class="flex flex-1 items-center justify-between border-b border-t border-slate-700 transition-all hover:bg-slate-900/80"
					>
						<div class="flex-1 px-4 py-4 text-sm">
							<p class="font-medium transition-all hover:text-slate-600">
								{workspace.workspace.name}
							</p>
						</div>
					</div>

					<div class="flex flex-shrink-0 rounded-r-md border-b border-r border-t border-slate-700">
						<Button
							on:click={() => openDeleteAlert(workspace.workspaceId)}
							class="my-auto h-full w-full rounded-l-none rounded-r-md"
							variant="ghost"><Trash class="size-4 text-slate-400"></Trash></Button
						>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<AlertDialog.Root bind:open={showDeleteAlert}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Remove from Workspace</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to remove this user form the workspace?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/removeUserFromWorkspace" id="removeUserFromWorkspace" use:enhance>
			<input type="hidden" name="workspaceId" value={currentWorkspaceId} />
			<input type="hidden" name="userId" value={data.user.id} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:click={() => (showDeleteAlert = false)}>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action class="bg-red-800 text-white" type="submit">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
