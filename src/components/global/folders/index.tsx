"use client";
import FolderDuotone from "@/components/icons/folder-duotone";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

import Folder from "./folder";

import { getWorkspaceFolders } from "@/actions/workspace";
import { useMutationDataState } from "@/hooks/use-mutation-data";
import { useQuery } from "@tanstack/react-query";

type Props = {
  workspaceId: string;
};

const Folders = ({ workspaceId }: Props) => {
  const { data } = useQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  //const { status, folders } = data as FoldersProps;

  const { latestVariables } = useMutationDataState(["create-folder"]);

  return (
    <div className="flex flex-col gap-4" suppressHydrationWarning>
      <div className="flex items-center  justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />
          <h2 className="text-[#BDBDBD] text-xl"> Folders</h2>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[#BDBDBD]">See all</p>
          <ArrowRight color="#707070" />
        </div>
      </div>
      <div
        className={cn(
          data?.status !== 200 && "justify-center",
          "flex items-center gap-4 overflow-x-auto w-full"
        )}
      >
        {data?.status !== 200 ? (
          <p className="text-neutral-300">No folders in workspace</p>
        ) : (
          <>
            {latestVariables && latestVariables.status === "pending" && (
              <Folder
                name={latestVariables.variables.name}
                id={latestVariables.variables.id}
                optimistic
              />
            )}
            {data.folders?.map((folder) => (
              <Folder
                name={folder.name}
                count={folder._count.videos}
                id={folder.id}
                key={folder.id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Folders;
