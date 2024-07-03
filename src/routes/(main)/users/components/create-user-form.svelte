<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { userSchema, type UserSchema } from '$lib/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { AlertDialogCancel } from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	export let onSubmitSuccess: () => void;
	export let data: SuperValidated<Infer<UserSchema>>;

	const form = superForm(data, {
		validators: zodClient(userSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				onSubmitSuccess();
			}
		}
	});

	const { form: formData, errors, enhance } = form;

	export function submitForm() {
		// Programmatically submit the form
		const formElement = document.querySelector('form');
		if (formElement) {
			formElement.requestSubmit();
		}
	}
</script>

<form method="POST" use:enhance action="?/createUser">
	<div class="flex flex-col gap-4">
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Form.FieldErrors>{$errors.name}</Form.FieldErrors>
				<Input {...attrs} bind:value={$formData.name} required />
			</Form.Control>
			<Form.Description>This is the public name visible to all workspaces.</Form.Description>
		</Form.Field>
	</div>

	<div class="mt-6 flex w-full justify-end gap-4">
		<AlertDialogCancel>Cancel</AlertDialogCancel>
		<Button type="submit">Create User</Button>
	</div>
</form>
