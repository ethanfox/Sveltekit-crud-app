import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const { userIds, workspaceId } = await request.json();

	if (!Array.isArray(userIds) || userIds.length === 0 || !workspaceId) {
		return json({ success: false, message: 'Invalid input' }, { status: 400 });
	}

	try {
		// First, get existing assignments
		const existingAssignments = await prisma.userWorkspace.findMany({
			where: {
				workspaceId: workspaceId,
				userId: { in: userIds }
			},
			select: { userId: true }
		});

		const existingUserIds = new Set(existingAssignments.map((a) => a.userId));

		// Filter out already assigned users
		const newUserIds = userIds.filter((id) => !existingUserIds.has(id));

		// Create new assignments
		const assignments = await prisma.userWorkspace.createMany({
			data: newUserIds.map((userId) => ({
				userId,
				workspaceId
			}))
		});

		return json({
			success: true,
			message: `${assignments.count} new user(s) assigned to workspace`,
			assignedCount: assignments.count,
			alreadyAssignedCount: existingUserIds.size
		});
	} catch (error) {
		console.error('Error assigning users to workspace:', error);
		return json(
			{ success: false, message: 'Failed to assign users to workspace' },
			{ status: 500 }
		);
	}
};
