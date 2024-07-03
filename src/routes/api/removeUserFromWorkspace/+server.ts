// src/routes/api/removeUserFromWorkspace/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const { userId, workspaceId } = await request.json();

	if (!userId || !workspaceId) {
		return json(
			{ success: false, message: 'User ID and Workspace ID are required' },
			{ status: 400 }
		);
	}
	try {
		await prisma.userWorkspace.delete({
			where: {
				userId_workspaceId: {
					userId: userId,
					workspaceId: workspaceId
				}
			}
		});

		return json({ success: true, message: 'User removed from workspace successfully' });
	} catch (error) {
		console.error('Error removing user from workspace:', error);
		return json(
			{ success: false, message: 'Failed to remove user from workspace' },
			{ status: 500 }
		);
	}
};
