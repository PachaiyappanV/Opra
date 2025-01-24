"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401 };
    }

    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    });
    return { status: 200, workspace: isUserInWorkspace };
  } catch (error) {
    return { status: 404, workspace: null };
  }
};
