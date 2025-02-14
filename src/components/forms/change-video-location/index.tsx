import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMoveVideos } from "@/hooks/use-move-videos";
import { ChevronDown } from "lucide-react";
import React, { useRef } from "react";

type Props = {
  videoId: string;
  currentFolder?: string;
  currentWorkSpace?: string;
  currentFolderName?: string;
};

const ChangeVideoLocation = ({
  videoId,
  currentFolder,
  currentFolderName,
  currentWorkSpace,
}: Props) => {
  const {
    register,
    isPending,
    onFormSubmit,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkSpace!, currentFolder!);

  const folder = folders.find((f) => f.id === currentFolder);
  const workspace = workspaces.find((f) => f.id === currentWorkSpace);

  return (
    <form className="flex flex-col gap-y-5" onSubmit={onFormSubmit}>
      <div className="boder-[1px] rounded-xl p-5">
        <h2 className="text-sm text-[#a4a4a4]">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-sm text-[#a4a4a4] mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : "This video has no folder"}
      </div>

      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
        <h2 className="text-sm text-[#a4a4a4]">To</h2>
        <Label className="flex-col gap-y-2 flex">
          <p className="text-sm">Workspace</p>
          <div className="relative w-full ">
            <select
              id="workspace-select"
              className="w-full appearance-none  rounded-md border dark:border-neutral-600 dark:bg-neutral-900 p-2 text-base text-neutral-700 dark:text-[#a4a4a4] "
              {...register("workspace_id")}
            >
              {workspaces.map((space) => (
                <option
                  key={space.id}
                  className=" dark:bg-neutral-800 text-neutral-700 dark:text-[#a4a4a4] "
                  value={space.id}
                >
                  {space.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2  text-[#a4a4a4] pointer-events-none"
            />
          </div>
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-[40px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="text-sm">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <div className="relative w-full ">
                <select
                  id="folder-select"
                  {...register("folder_id")}
                  className=" appearance-none w-full rounded-md border dark:border-neutral-600 dark:bg-neutral-900 p-2 text-base text-neutral-700 dark:text-[#a4a4a4] "
                >
                  {isFolders.map((folder) => (
                    <option
                      className="dark:bg-neutral-800 text-neutral-700 dark:text-[#a4a4a4] "
                      key={folder.id}
                      value={folder.id}
                    >
                      {folder.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2  text-[#a4a4a4] pointer-events-none"
                />
              </div>
            ) : (
              <p className="text-[#a4a4a4] text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>
      <Button
        variant="outline"
        className="bg-[#E0E0E0]  dark:bg-[#1D1D1D] text-[#707070]"
      >
        <Loader state={isPending} color="#000">
          Move
        </Loader>
      </Button>
    </form>
  );
};

export default ChangeVideoLocation;
