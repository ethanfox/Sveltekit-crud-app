import { prisma } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { workspaceSchema } from '$lib/schemas.js';

export const load = async ({ params }) => {
	const workspaceId = params.id;
	console.log('params.id:', params.id); // Log the ID for debugging
	const workspace = await prisma.workspace.findUnique({
		where: {
			id: workspaceId // Fetch workspace by ID
		}
	});

	if (!workspace) {
		return {
			status: 404,
			error: new Error('Workspace not found')
		};
	}
	const form = await superValidate(workspace, zod(workspaceSchema));
	return { form, workspace };
};

export const actions: Actions = {
	updateWorkspace: async (event) => {
		try {
			// Get the form data first
			const formData = await event.request.formData();

			// Now pass the formData to superValidate
			const form = await superValidate(formData, zod(workspaceSchema));

			console.log('Parsed form:', form);

			if (!form.valid) {
				return fail(400, { form });
			}

			const updatedWorkspace = await prisma.workspace.update({
				where: { id: form.data.id },
				data: {
					name: form.data.name,
					color: form.data.color
					// Update other fields as needed
				}
			});

			console.log('Updated workspace:', updatedWorkspace);

			return { form, workspace: updatedWorkspace, message: 'Workspace updated successfully' };
		} catch (error) {
			console.error('Error updating workspace:', error);
			return fail(500, { message: 'Failed to update workspace' });
		}
	}
};
