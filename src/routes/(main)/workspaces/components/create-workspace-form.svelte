<script lang="ts">
	import { writable } from 'svelte/store';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { Input } from '$lib/components/ui/input';
	import { workspaceSchema, type WorkspaceSchema } from '$lib/schemas';
	// import { workspace, type FormSchema } from "./schema";
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { AlertDialogCancel } from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	export let onSubmitSuccess: () => void;
	export let data: SuperValidated<Infer<WorkspaceSchema>>;

	const form = superForm(data, {
		validators: zodClient(workspaceSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				onSubmitSuccess();
			}
		}
	});

	const { form: formData, errors, enhance } = form;
	const colors = [
		{ value: '#991b1b', label: 'Red' },
		{ value: '#9a3412', label: 'Orange' },
		{ value: '#3f6212', label: 'Green' },
		{ value: '#075985', label: 'Blue' },
		{ value: '#115e59', label: 'Teal' }
	];

	export function submitForm() {
		// Programmatically submit the form
		const formElement = document.querySelector('form');
		if (formElement) {
			formElement.requestSubmit();
		}
	}
	let selectedColor = writable('');

	function handleColorSelect(selected: Selected<string> | undefined) {
		if (selected) {
			$formData.color = selected.value;
		}
	}
</script>

<form method="POST" use:enhance action="?/createWorkspace">
	<div class="flex flex-col gap-4">
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Workspace Name</Form.Label>
				<Form.FieldErrors>{$errors.name}</Form.FieldErrors>
				<Input {...attrs} bind:value={$formData.name} required />
			</Form.Control>
			<Form.Description>This is the public name for this workspace.</Form.Description>
		</Form.Field>
		<Form.Field {form} name="color">
			<Form.Control let:attrs>
				<Form.Label>Workspace Color</Form.Label>
				<Form.FieldErrors>{$errors.color}</Form.FieldErrors>

				<Select.Root onSelectedChange={handleColorSelect} portal={null}>
					<Select.Trigger class="w-[180px]">
						<Select.Value placeholder="Select a color" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Workspace Color</Select.Label>
							{#each colors as color}
								<div class="flex gap-2">
									<div
										class="my-auto size-3 flex-none rounded-full"
										style="background-color: {color.value};"
									></div>
									<Select.Item value={color.value} label={color.label}>{color.label}</Select.Item>
								</div>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<input type="hidden" name="color" bind:value={$formData.color} />
			</Form.Control>
			<Form.Description
				>This is the color that will be associated with your workspace.</Form.Description
			>
		</Form.Field>
	</div>

	<div class="mt-6 flex w-full justify-end gap-4">
		<AlertDialogCancel>Cancel</AlertDialogCancel>
		<Button type="submit">Create Workspace</Button>
	</div>
</form>
