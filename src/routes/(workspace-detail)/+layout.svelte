<script lang="ts">
	import SidebarNav from './components/sidebar-nav.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	import { page } from '$app/stores';

	$: workspaceId = $page.data.workspace?.id;
	let workspaceName = $page.data.workspace?.name ?? 'Workspace Details';

	$: sidebarNavItems = [
		{
			title: 'Workplace Details',
			href: workspaceId ? `/workspace/${workspaceId}` : '/workspaces'
		},
		{
			title: 'Members',
			href: workspaceId ? `/workspace-members/${workspaceId}` : '/workspaces'
		}
	];
</script>

<div class="hidden space-y-6 p-10 pb-16 md:block">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">{workspaceName}</h2>
		<p class="text-muted-foreground">Manage workspace details and assigned users.</p>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<aside class="-mx-4 lg:w-1/5">
			<Button variant="outline" on:click={() => goto('/workspaces')}>
				<ChevronLeft class="mr-2 h-4 w-4" />
				Back
			</Button>
			<SidebarNav items={sidebarNavItems} />
		</aside>
		<div class="flex-1 lg:max-w-2xl">
			<slot />
		</div>
	</div>
</div>
