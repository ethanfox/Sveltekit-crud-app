<script lang="ts">
	import UserDetailForm from '../../components/user-detail-form.svelte';
	import { Separator } from '$lib/components/ui/separator';

	export let data: any;
	$: user = data.updateUserForm.data;
</script>

<div class="mx-auto my-8 flex max-w-3xl flex-col gap-4">
	<div>
		{#if user}
			<div class="flex w-full justify-between">
				<p class="text-2xl font-semibold">{user.name}</p>
				<p class="text-slate-600">ID: {user.id}</p>
			</div>
		{:else}
			<p>Loading...</p>
		{/if}
	</div>

	<Separator />
</div>

<UserDetailForm data={data.updateUserForm} />
