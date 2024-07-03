<script lang="ts">
	import { Button } from '$lib/components/ui/button';

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
	console.log('data', data);

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
		</div>

		<WorkspaceTable {data} />
	</div>
</div>
