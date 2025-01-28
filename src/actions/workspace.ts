"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
export const verifyAccessToWorkspace = async (workSpaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401 };
    }

    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workSpaceId,
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

export const getWorkspaceVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401 };
    }

    const videos = await client.video.findMany({
      where: {
        workSpaceId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (videos && videos.length) {
      return { status: 200, data: { videos } };
    }
  } catch (error) {
    return { status: 500 };
  }
};

export const getWorkspaces = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401 };
    }

    const workspaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
    if (workspaces) {
      return { status: 200, data: workspaces };
    }
  } catch (error) {
    return { status: 500 };
  }
};
