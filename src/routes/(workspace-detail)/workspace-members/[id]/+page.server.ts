import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { editWorkSpaceMembers, workspaceSchema } from '$lib/schemas.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const users = await prisma.user.findMany();
	const addUsersForm = await superValidate(zod(editWorkSpaceMembers));
	const workspaceId = params.id;
	const workspace = await prisma.workspace.findUnique({
		where: {
			id: workspaceId // Fetch workspace by ID
		}
	});
	const workspaceMembers = await prisma.workspace.findUnique({
		where: { id: workspaceId },
		include: {
			users: {
				include: {
					user: true
				}
			}
		}
	});

	return { workspaceMembers, workspace, addUsersForm, users };
};

export const actions: Actions = {
	removeUserFromWorkspace: async ({ request, fetch }) => {
		console.log('addUsersToWorkspace action');
		const formData = await request.formData();
		// Now pass the formData to superValidate
		const form = await superValidate(formData, zod(editWorkSpaceMembers));
		console.log('Parsed form:', form);
		const workspaceId = formData.get('workspaceId') as string;
		const userId = formData.get('userId') as string;

		if (!workspaceId || !userId) {
			return fail(400, {
				message: 'Invalid input: Workspace ID and at least one User ID are required'
			});
		}

		try {
			const response = await fetch('/api/removeUserFromWorkspace', {
				method: 'POST',
				body: JSON.stringify({ userId, workspaceId }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (result.success) {
				return {
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
