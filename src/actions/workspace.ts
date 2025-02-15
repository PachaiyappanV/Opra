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
    return { status: 200, workspace: isUserInWorkspace };
  } catch (error) {
    return { status: 403 };
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
      orderBy: {
        createdAt: "asc",
      },
    });

    if (isFolders && isFolders.length) {
      return { status: 200, folders: isFolders };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getVideos = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401 };
    }

    const videos = await client.video.findMany({
      where: {
        OR: [{ folderId: id }, { workSpaceId: id }],
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
      return { status: 200, videos };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getWorkspaces = async () => {
  try {
    const loggedUser = await currentUser();
    if (!loggedUser) {
      return { status: 401 };
    }

    const user = await client.user.findUnique({
      where: {
        clerkid: loggedUser.id,
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
    if (user) {
      return { status: 200, user };
    }
  } catch (error) {
    return { status: 500 };
  }
};

export const createWorkspace = async (name: string) => {
  try {
    const loggedUser = await currentUser();
    if (!loggedUser) {
      return { status: 401 };
    }

    const user = await client.user.findUnique({
      where: {
        clerkid: loggedUser.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (user?.subscription?.plan === "PRO") {
      const workspace = await client.user.update({
        where: {
          clerkid: loggedUser.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: "PUBLIC",
            },
          },
        },
      });

      if (workspace) {
        return { status: 201, message: "Workspace created successfully" };
      }
    }
    return {
      status: 403,
      message: "You are not authorized to create a workspace.",
    };
  } catch (error) {
    return { status: 500 };
  }
};

export const createFolder = async (workspaceId: string) => {
  try {
    const isNewFolder = await client.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: { name: "Untitled" },
        },
      },
    });
    if (isNewFolder) {
      return { status: 201, message: "New Folder Created" };
    }
  } catch (error) {
    return { status: 500, message: "Oops something went wrong" };
  }
};

export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    });
    if (folder) {
      return { status: 200, message: "Folder Renamed" };
    }
    return { status: 404, message: "Folder does not exist" };
  } catch (error) {
    return { status: 500, message: "Oops! something went wrong" };
  }
};

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (folder) {
      return { status: 200, folder };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const moveVideoLocation = async (
  videoId: string,
  workSpaceId: string,
  folderId: string
) => {
  try {
    const location = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId,
      },
    });
    if (location) return { status: 200, message: "video moved successfully" };
    return { status: 404, message: "workspace/folder not found" };
  } catch (error) {
    return { status: 500, message: "Oops! something went wrong" };
  }
};

export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401 };
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summery: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkid: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });
    if (video) {
      return {
        status: 200,
        video,
        author: user.id === video.User?.clerkid ? true : false,
      };
    }

    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};
