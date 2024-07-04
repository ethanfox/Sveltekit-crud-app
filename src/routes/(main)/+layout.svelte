<script lang="ts">
	import TopbarNav from './components/topbar-nav.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { goto } from '$app/navigation';

	const sidebarNavItems = [
		{
			title: 'Users',
			href: '/users'
		},
		{
			title: 'Workspaces',
			href: '/workspaces'
		}
	];

	import { ModeWatcher } from 'mode-watcher';
	import '../../app.css';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="hidden space-y-6 p-10 pb-16 md:block">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Workspaces.ai</h2>
		<p class="text-muted-foreground">Manage users and workspaces like never before.</p>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col space-y-8 lg:space-y-0">
		<TopbarNav items={sidebarNavItems} />

		<div class=" flex-1">
			{@render children()}

			<!-- <slot /> -->
		</div>
	</div>
</div>
