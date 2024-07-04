<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { Input } from '$lib/components/ui/input';
	import { workspaceSchema, type WorkspaceSchema } from '$lib/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/button/button.svelte';
	import Trash from 'lucide-svelte/icons/trash-2';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { goto } from '$app/navigation';

	export let data: SuperValidated<Infer<WorkspaceSchema>>;

	let showDeleteAlert = false;

	const form = superForm(data, {
		id: 'workspace-detail-form',
		validators: zodClient(workspaceSchema),
		onUpdated(event) {
			data = event.form.data;
			$formData = event.form.data;
		}
	});
	const { form: formData, errors, enhance: updateEnhance } = form;

	const deleteForm = superForm(data, {
		id: 'workspace-delete-form',
		validators: zodClient(workspaceSchema),
		onUpdated(event) {
			goto('/workspaces');
		}
	});
	const { form: deleteFormData, enhance: deleteEnhance } = deleteForm;

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
</script>

<form action="?/updateWorkspace" method="POST" use:updateEnhance>
	<div class="flex flex-col gap-4">
		<Form.Field {form} name="id">
			<Form.Control let:attrs>
				<Input type="hidden" {...attrs} bind:value={$formData.id} />
			</Form.Control>
		</Form.Field>

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
								<Select.Item value={color.value} label={color.label}
									><div class="flex gap-2">
										<div
											class="my-auto size-3 flex-none rounded-full"
											style="background-color: {color.value};"
										></div>
										{color.label}
									</div></Select.Item
								>
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
		<Button variant="destructive" on:click={() => (showDeleteAlert = true)}
			><div class="flex gap-2">
				<Trash class="size-5" />Delete Workspace
			</div></Button
		>
		<Button type="submit">Update Workspace</Button>
	</div>
</form>

<AlertDialog.Root bind:open={showDeleteAlert}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Workspace</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this workspace? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deleteWorkspace" id="deleteWorkspace" use:deleteEnhance>
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
