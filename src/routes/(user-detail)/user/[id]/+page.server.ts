import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schemas.js';

const crudSchema = userSchema.extend({
	id: userSchema.shape.id.optional()
});

export const load = async ({ params }) => {
	const userId = params.id;

	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});

	console.log('user:', user);

	if (!user) {
		return {
			status: 404,
			error: new Error('User not found')
		};
	}
	const form = await superValidate(user, zod(crudSchema));
	return { form, user };
};

export const actions: Actions = {
	default: async (event) => {
		try {
			// Get the form data first
			const formData = await event.request.formData();

			// Now pass the formData to superValidate
			const form = await superValidate(formData, zod(crudSchema));

			console.log('Parsed form:', form);

			if (!form.valid) {
				return fail(400, { form });
			}

			const updatedUser = await prisma.user.update({
				where: { id: form.data.id },
				data: {
					name: form.data.name
					// Update other fields as needed
				}
			});

			console.log('Updated user:', updatedUser);

			// return message(form, 'User updated successfully');
			return { form, user: updatedUser, message: 'User updated successfully' };
		} catch (error) {
			console.error('Error updating user:', error);
			return fail(500, { message: 'Failed to update user' });
		}
	}
};
