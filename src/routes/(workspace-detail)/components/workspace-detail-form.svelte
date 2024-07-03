<script lang="ts">
	import { writable } from 'svelte/store';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { Input } from '$lib/components/ui/input';
	import { workspaceSchema, type WorkspaceSchema } from '$lib/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: SuperValidated<Infer<WorkspaceSchema>>;

	const form = superForm(data, {
		validators: zodClient(workspaceSchema)
	});

	const { form: formData, errors, enhance } = form;

	export function submitForm() {
		const formElement = document.querySelector('form');
		if (formElement) {
			formElement.requestSubmit();
		}
	}

	function handleColorSelect(selected: Selected<string> | undefined) {
		if (selected) {
			$formData.color = selected.value;
		}
	}

	console.log('FORM DATA', $formData);
	const colors = [
		{ value: '#991b1b', label: 'Red' },
		{ value: '#9a3412', label: 'Orange' },
		{ value: '#3f6212', label: 'Green' },
		{ value: '#075985', label: 'Blue' },
		{ value: '#115e59', label: 'Teal' }
	];
	let selected = { value: 'Select a color', label: 'Select a color' };

	$: {
		formData.subscribe((value) => {
			let selectedColorLabel =
				colors.find((c) => c.value === value.color)?.label ?? 'Select a color';

			selected = { value: value.color, label: selectedColorLabel };
		});
	}

	import { goto } from '$app/navigation';
</script>

<form action="?/updateWorkspace" method="POST" use:enhance>
	<div class="flex flex-col gap-4">
		<Form.Field {form} name="id">
			<Form.Control let:attrs>
				<Input type="hidden" {...attrs} bind:value={$formData.id} />
			</Form.Control></Form.Field
		>

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

				<Select.Root bind:selected onSelectedChange={handleColorSelect} portal={null}>
					<Select.Trigger class="w-[180px]">
						<Select.Value>{selected.label}</Select.Value>
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
		<!-- <Button variant="destructive" on:click={() => (showDeleteAlert = true)}>Delete Workspace</Button
		> -->
		<Button type="submit">Update Workspace</Button>
	</div>
</form>
