import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { useMutationData } from "./use-mutation-data";
import { getWorkspaceFolders, moveVideoLocation } from "@/actions/workspace";
import useZodForm from "./use-zod-form";
import { moveVideoSchema } from "@/components/forms/change-video-location/schema";

export const useMoveVideos = (
  videoId: string,
  currentWorkspace: string,
  currentFolder: string
) => {
  const { folders } = useAppSelector((state) => state.FolderReducer);
  const { workspaces } = useAppSelector((state) => state.WorkSpaceReducer);

  const [isFetching, setIsFetching] = useState(false);
  const [isFolders, setIsFolders] = useState<
    | ({
        _count: {
          videos: number;
        };
      } & {
        id: string;
        name: string;
        createdAt: Date;
        workSpaceId: string | null;
      })[]
    | undefined
  >(undefined);

  const { mutate, isPending } = useMutationData(
    ["change-video-location"],

    (data: { folder_id: string; workspace_id: string }) =>
      moveVideoLocation(videoId, data.workspace_id, data.folder_id),
    [["workspace-folders"], ["workspace-videos"]]
  );

  const { errors, onFormSubmit, watch, register } = useZodForm(
    moveVideoSchema,
    mutate,
    { folder_id: currentFolder, workspace_id: currentWorkspace }
  );

  const fetchFolders = async (workspace: string) => {
    setIsFetching(true);
    const data = await getWorkspaceFolders(workspace);
    setIsFetching(false);
    setIsFolders(data.folders);
  };

  useEffect(() => {
    fetchFolders(currentWorkspace);
  }, []);
  useEffect(() => {
    const workspaceId = watch("workspace_id");

    if (workspaceId) {
      fetchFolders(workspaceId);
    }
  }, [watch("workspace_id")]);

  return {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  };
};
