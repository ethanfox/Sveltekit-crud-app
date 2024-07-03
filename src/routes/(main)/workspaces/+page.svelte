<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import CreateWorkspaceForm from './components/create-workspace-form.svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import {
		AlertDialog,
		AlertDialogTrigger,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogContent,
		AlertDialogHeader
	} from '$lib/components/ui/alert-dialog';
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

			<AlertDialog bind:open={showDialog}>
				<AlertDialogTrigger>
					<Button>
						<Plus class="mr-2 h-4 w-4" />
						Create Workspace
					</Button>
				</AlertDialogTrigger>

				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Create Workspace</AlertDialogTitle>
						<AlertDialogDescription>
							Enter a name and select a color for your new workspace.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<CreateWorkspaceForm
						bind:this={createWorkspaceForm}
						data={data.createWorkspaceForm}
						onSubmitSuccess={handleFormSubmitted}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</div>

		<WorkspaceTable {data} />
	</div>
</div>
