"use client";
import FolderDuotone from "@/components/icons/folder-duotone";

import Folder from "./folder";
import { getWorkspaceFolders } from "@/actions/workspace";
import { useMutationDataState } from "@/hooks/use-mutation-data";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { FOLDERS } from "@/redux/slices/folders";
import Videos from "../videos";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  workspaceId: string;
};

const Folders = ({ workspaceId }: Props) => {
  const dispatch = useDispatch();
  const { data, isFetched, isPending } = useQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  if (isFetched && data?.folders) {
    dispatch(FOLDERS({ folders: data.folders }));
  }

  const { latestVariables } = useMutationDataState(["create-folder"]);

  return (
    <div className="flex flex-col gap-4" suppressHydrationWarning>
      <div className="flex items-center  justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />
          <h2 className="dark:text-[#BDBDBD] text-xl"> Folders</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 w-full">
        {isPending ? (
          <>
            <Skeleton className="h-[78px] w-[250px]" />
            <Skeleton className="h-[78px] w-[250px]" />
            <Skeleton className="h-[78px] w-[250px]" />
            <Skeleton className="h-[78px] w-[250px]" />
          </>
        ) : data?.status !== 200 ? (
          <p className="text-neutral-500">No folders in workspace</p>
        ) : (
          <>
            {data.folders?.map((folder) => (
              <Folder
                name={folder.name}
                count={folder._count.videos}
                id={folder.id}
                key={folder.id}
              />
            ))}
            {latestVariables && latestVariables.status === "pending" && (
              <Folder
                name={latestVariables.variables.name}
                id={latestVariables.variables.id}
                optimistic
              />
            )}
          </>
        )}
      </div>
      <Videos
        workspaceId={workspaceId}
        folderId={workspaceId}
        videosKey="workspace-videos"
      />
    </div>
  );
};

export default Folders;
