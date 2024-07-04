import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const { userId } = await request.json();

	try {
		await prisma.user.delete({
			where: { id: userId }
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting user:', error);
		return json({ success: false, message: 'Failed to delete user' }, { status: 500 });
	}
};
