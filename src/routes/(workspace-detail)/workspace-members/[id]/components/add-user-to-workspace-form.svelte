<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { editWorkSpaceMembers, type EditWorkSpaceMembers } from '$lib/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { AlertDialogCancel } from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	export let onSubmitSuccess: () => void;
	export let data: SuperValidated<Infer<EditWorkSpaceMembers>>;
	export let workspaceId: string;
	export let users: { id: string; name: string }[];
	console.log('RETARD ADTAA', data);

	const form = superForm(data, {
		validators: zodClient(editWorkSpaceMembers),
		id: 'addUsersToWorkspace',
		onResult: ({ result }) => {
			console.log(result);
			if (result.type === 'success') {
				onSubmitSuccess();
			}
		}
	});

	const { form: addUsersForm, errors, enhance: enhanceAddUsersToWorkspace } = form;

	let selectedUsers: string[] = [];

	function toggleUser(userId: string) {
		$addUsersForm.workspaceId = workspaceId;
		if (selectedUsers.includes(userId)) {
			selectedUsers = selectedUsers.filter((id) => id !== userId);
		} else {
			selectedUsers = [...selectedUsers, userId];
			console.log('selectedUsers', selectedUsers);

			$addUsersForm.userIds = selectedUsers;
			console.log('addUsersForm', $addUsersForm);
		}
	}
</script>

<form
	method="POST"
	use:enhanceAddUsersToWorkspace
	id="addToWorkspace"
	action="?/addUsersToWorkspace"
>
	<input type="hidden" name="workspaceId" value={workspaceId} />

	<div class="flex flex-col gap-4">
		<Form.Field {form} name="userIds">
			<Form.Control let:attrs>
				<Form.Label>Select users to add to workspace</Form.Label>
				<Form.FieldErrors>{$errors.userIds}</Form.FieldErrors>
				<ScrollArea class="h-72 w-full rounded-md border p-4">
					<div class="space-y-2">
						{#each users as user}
							<div class="mt-1 flex items-center space-x-2 rounded-md border p-4">
								<Checkbox
									id={user.id}
									checked={selectedUsers.includes(user.id)}
									onCheckedChange={() => toggleUser(user.id)}
								/>
								<label
									for={user.id}
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{user.name}
								</label>
							</div>
						{/each}
					</div>
				</ScrollArea>
			</Form.Control>
		</Form.Field>
	</div>

	{#each selectedUsers as userId}
		<input type="hidden" name="userIds[]" value={userId} />
	{/each}

	<div class="mt-6 flex w-full justify-end gap-4">
		<AlertDialogCancel>Cancel</AlertDialogCancel>
		<Button type="submit">Add to Workspace</Button>
	</div>
</form>
