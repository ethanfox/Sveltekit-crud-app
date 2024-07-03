import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { workspaceSchema, editWorkSpaceMembers } from '$lib/schemas.js';
import { zod } from 'sveltekit-superforms/adapters';

const crudSchema = workspaceSchema.extend({
	id: workspaceSchema.shape.id.optional()
});

export const load: PageServerLoad = async () => {
	const createWorkspaceForm = await superValidate(zod(workspaceSchema));
	const addUsersForm = await superValidate(zod(editWorkSpaceMembers));
	const users = await prisma.user.findMany();

	const workspaces = await prisma.workspace.findMany({
		select: {
			id: true,
			name: true,
			color: true,
			_count: {
				select: { users: true }
			}
		}
	});

	return { users, workspaces, createWorkspaceForm, addUsersForm };
};

export const actions: Actions = {
	createWorkspace: async (event) => {
		try {
			// Get the form data first
			const formData = await event.request.formData();

			// Now pass the formData to superValidate
			const form = await superValidate(formData, zod(crudSchema));

			console.log('Parsed form:', form);

			if (!form.valid) {
				console.log('Invalid form:', form);
				return fail(400, { form });
			}

			const newWorkspace = await prisma.workspace.create({
				data: {
					name: form.data.name,
					color: form.data.color
					// Update other fields as needed
				}
			});

			console.log('New workspace:', newWorkspace);

			return { form, message: 'Workspace created successfully' };
		} catch (error) {
			console.error('Error creating workspace:', error);
			return fail(500, { message: 'Failed to create workspace' });
		}
	},
	deleteWorkspace: async ({ request, fetch }) => {
		const formData = await request.formData();
		const workspaceId = formData.get('workspaceId') as string;
		const form = await superValidate(formData, zod(crudSchema));

		try {
			const response = await fetch('/api/deleteWorkspace', {
				method: 'POST',
				body: JSON.stringify({ workspaceId }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (result.success) {
				return { success: true };
			} else {
				return fail(500, { form, message: 'Failed to delete workspace' });
			}
		} catch (error) {
			console.error('Error deleting workspace:', error);
			return fail(500, { form, message: 'An error occurred while deleting the workspace' });
		}
	},
	addUsersToWorkspace: async ({ request, fetch }) => {
		console.log('addUsersToWorkspace action');
		const formData = await request.formData();
		// Now pass the formData to superValidate
		const form = await superValidate(formData, zod(editWorkSpaceMembers));
		console.log('Parsed form:', form);
		const workspaceId = formData.get('workspaceId') as string;
		const userIds = formData.getAll('userIds[]').map((id) => id.toString());

		if (!workspaceId || userIds.length === 0) {
			return fail(400, {
				message: 'Invalid input: Workspace ID and at least one User ID are required'
			});
		}

		try {
			const response = await fetch('/api/addUserToWorkspace', {
				method: 'POST',
				body: JSON.stringify({ userIds, workspaceId }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (result.success) {
				return {
					form,
					success: true,
					assignedCount: result.assignedCount,
					alreadyAssignedCount: result.alreadyAssignedCount
				};
			} else {
				return fail(500, { message: result.message || 'Failed to add users to workspace' });
			}
		} catch (error) {
			console.error('Error adding users to workspace:', error);
			return fail(500, { message: 'An error occurred while adding users to the workspace' });
		}
	}
};
