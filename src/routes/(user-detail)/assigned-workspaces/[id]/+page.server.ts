import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { editWorkSpaceMembers, workspaceSchema } from '$lib/schemas.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const userId = params.id;
	const user = await prisma.user.findUnique({
		where: {
			id: userId // Fetch workspace by ID
		}
	});
	const assignedWorkspaces = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			workspaces: {
				include: {
					workspace: true
				}
			}
		}
	});

	return { assignedWorkspaces, user };
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
	}
};
