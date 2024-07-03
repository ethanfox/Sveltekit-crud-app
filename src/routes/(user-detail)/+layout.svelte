<script lang="ts">
	import SidebarNav from './components/sidebar-nav.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';

	$: userId = $page.data.user?.id;
	let userName = $page.data.user?.name ?? 'User Details';
	$: sidebarNavItems = [
		{
			title: 'Profile',
			href: userId ? `/user/${userId}` : '/users'
		},
		{
			title: 'Assigned Workspaces',
			href: userId ? `/assigned-workspaces/${userId}` : '/users'
		}
	];
</script>

<div class="hidden space-y-6 p-10 pb-16 md:block">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">{userName}</h2>
		<p class="text-muted-foreground">Manage user details and assigned workspaces.</p>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<aside class="-mx-4 lg:w-1/5">
			<Button variant="outline" on:click={() => goto('/users')}>
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
