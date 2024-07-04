<script lang="ts">
	import WorkspaceDetailForm from '../../components/workspace-detail-form.svelte';
	import { Separator } from '$lib/components/ui/separator';
	export let data: any;

	// console.log('DATA', data);
	// let workspace = data?.workspace;

	$: workspace = data.updateWorkspaceForm.data;
</script>

<div class="mx-auto my-8 flex max-w-3xl flex-col gap-4">
	<div>
		{#if workspace}
			<div class="flex w-full justify-between">
				<div class="flex gap-2">
					<div
						class="my-auto size-6 flex-none rounded-full"
						style="background-color: {workspace.color};"
					></div>
					<p class="text-2xl font-semibold">{workspace.name}</p>
				</div>

				<p class="text-slate-600">ID: {workspace.id}</p>
			</div>

			<!-- Add more user details here -->
		{:else}
			<p>Loading...</p>
		{/if}
	</div>

	<Separator />
</div>

<WorkspaceDetailForm data={data.updateWorkspaceForm} />
