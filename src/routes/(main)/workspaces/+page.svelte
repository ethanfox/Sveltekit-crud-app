<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import CreateWorkspaceForm from './components/create-workspace-form.svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import WorkspaceTable from './components/workspace-table.svelte';

	let createWorkspaceForm: any;

	let { data } = $props();

	let showDialog = $state(false);

	function handleFormSubmitted() {
		console.log('Form submitted');
		showDialog = false;
	}
</script>

<div class=" mt-8 flex flex-col">
	<div class="space-y-6 rounded-md border p-4">
		<div class="mb-4 flex w-full justify-between">
			<h1 class="text-2xl font-semibold">Workspaces</h1>
			<div>
				<AlertDialog.Root bind:open={showDialog}>
					<AlertDialog.Trigger>
						<Button>
							<Plus class="mr-2 h-4 w-4" />
							Create Workspace
						</Button>
					</AlertDialog.Trigger>

					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Create Workspace</AlertDialog.Title>
							<AlertDialog.Description>
								Enter a name and select a color for your new workspace.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<CreateWorkspaceForm
							bind:this={createWorkspaceForm}
							data={data.createWorkspaceForm}
							onSubmitSuccess={handleFormSubmitted}
						/>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</div>

		<WorkspaceTable {data} />
	</div>
</div>
