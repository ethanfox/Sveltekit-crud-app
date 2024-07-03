import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { userSchema, workspaceSchema } from '$lib/schemas.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	const users = await prisma.user.findMany();
	//const workspaces = await prisma.workspace.findMany();
	const createUserForm = await superValidate(zod(userSchema));
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

	console.log('Workspaces:', workspaces);

	return { users, workspaces, createUserForm };
};

export const actions: Actions = {
	createUser: async (event) => {
		try {
			// Get the form data first
			const formData = await event.request.formData();

			// Now pass the formData to superValidate
			const form = await superValidate(formData, zod(userSchema));

			console.log('Parsed form:', form);

			if (!form.valid) {
				console.log('Invalid form:', form);
				return fail(400, { form });
			}

			const newUser = await prisma.user.create({
				data: {
					name: form.data.name

					// Update other fields as needed
				}
			});

			console.log('New user:', newUser);

			// return message(form, 'User updated successfully');
			return { form, message: 'Workspace created successfully' };
		} catch (error) {
			console.error('Error creating workspace:', error);
			return fail(500, { message: 'Failed to create workspace' });
		}
	}
};
