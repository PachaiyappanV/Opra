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
    return { status: 200, data: { workspace: isUserInWorkspace } };
  } catch (error) {
    return { status: 403, data: { workspace: null } };
  }
};

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (isFolders && isFolders.length) {
      return { status: 200, data: { folders: isFolders } };
    }
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 500, data: [] };
  }
};
