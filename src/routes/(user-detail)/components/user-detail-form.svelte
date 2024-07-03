<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { userSchema, type UserSchema } from '$lib/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<UserSchema>>;

	const form = superForm(data, {
		validators: zodClient(userSchema)
	});

	const { form: formData, enhance } = form;

	export function submitForm() {
		// Programmatically submit the form
		const formElement = document.querySelector('form');
		if (formElement) {
			formElement.requestSubmit();
		}
	}
</script>

<form method="POST" use:enhance>
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

	<Form.Button class="mt-2">Save Changes</Form.Button>
</form>
