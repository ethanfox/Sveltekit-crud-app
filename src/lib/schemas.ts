import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	name: z.string()
});
// export type UserSchema = typeof userSchema;
export type UserSchema = z.infer<typeof userSchema>;

export const workspaceSchema = z.object({
	id: z.string(),
	name: z.string().min(1, { message: 'Name is required' }),
	color: z.string().min(1, { message: 'Color is required' })
});
export type WorkspaceSchema = typeof workspaceSchema;

export const editWorkSpaceMembers = z.object({
	workspaceId: z.string().min(1, { message: 'A workspace is required' }),
	userIds: z.array(z.string()).min(1, { message: 'At least one user should be selected.' })
});

export type EditWorkSpaceMembers = typeof editWorkSpaceMembers;
