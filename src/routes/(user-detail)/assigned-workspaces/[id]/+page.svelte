<script lang="ts">
	import WorkspaceTable from './components/workspace-table.svelte';
	let { data } = $props();
</script>

<div class=" mt-8 flex flex-col">
	<div class="space-y-6 rounded-md border p-4">
		<div class="mb-4 flex w-full justify-between">
			<h1 class="text-2xl font-semibold">Workspaces</h1>
		</div>

		<WorkspaceTable {data} />
	</div>
</div>
