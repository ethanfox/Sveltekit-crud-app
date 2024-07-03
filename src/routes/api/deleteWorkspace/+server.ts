// src/routes/api/deleteWorkspace/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const { workspaceId } = await request.json();

	try {
		await prisma.workspace.delete({
			where: { id: workspaceId }
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting workspace:', error);
		return json({ success: false, message: 'Failed to delete workspace' }, { status: 500 });
	}
};
