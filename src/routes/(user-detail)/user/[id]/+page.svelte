<script lang="ts">
	import UserDetailForm from '../../components/user-detail-form.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Separator } from '$lib/components/ui/separator';

	export let data: any;

	let user = data?.user;

	const {
		form,
		errors,
		constraints,
		enhance,
		delayed,
		message: formMessage
	} = superForm(data.form, {
		resetForm: false,
		onUpdated(event) {
			if (data?.user) {
				user = data.user;
			}
		}
	});
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

<UserDetailForm data={data.form} />
