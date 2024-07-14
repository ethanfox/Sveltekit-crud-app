<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Trash from 'lucide-svelte/icons/trash-2';
	import { Input } from '$lib/components/ui/input';
	import { userSchema, type UserSchema } from '$lib/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';
	import { z } from 'zod';

	export let data: SuperValidated<z.infer<typeof userSchema>>;

	let showDeleteAlert = false;

	const form = superForm(data, {
		id: 'user-detail-form',
		validators: zodClient(userSchema),
		onUpdated(event) {
			data.data = event.form.data;
			$formData = event.form.data;
		}
	});

	const { form: formData, enhance: updateEnhance } = form;

	const deleteForm = superForm(data, {
		id: 'user-delete-form',
		validators: zodClient(userSchema),
		onUpdated(event) {
			goto('/users');
		}
	});
	const { form: deleteFormData, enhance: deleteEnhance } = deleteForm;

	export function submitForm() {
		// Programmatically submit the form
		const formElement = document.querySelector('form');
		if (formElement) {
			formElement.requestSubmit();
		}
	}
</script>

<form method="POST" action="?/updateUser" use:updateEnhance>
	<Form.Field {form} name="id">
		<Form.Control let:attrs>
			<Input type="hidden" {...attrs} bind:value={$formData.id} />
			<input type="hidden" name="id" bind:value={$formData.id} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description>This is the public name visible to all workspaces.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<div class="mt-6 flex w-full justify-end gap-4">
		<Button variant="destructive" on:click={() => (showDeleteAlert = true)}
			><div class="flex gap-2">
				<Trash class="size-5" />Delete User
			</div></Button
		>
		<Button type="submit">Update User</Button>
	</div>
</form>

<AlertDialog.Root bind:open={showDeleteAlert}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete User</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this user? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deleteUser" id="deleteUser" use:deleteEnhance>
			<Form.Field {form} name="id">
				<Form.Control let:attrs>
					<Input type="hidden" {...attrs} bind:value={$deleteFormData.id} />
				</Form.Control>
			</Form.Field>
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:click={() => (showDeleteAlert = false)}>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action class="bg-red-800 text-white" type="submit">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
