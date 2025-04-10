"use client";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import { Button } from "@/components/ui/button";
import { useCreateFolders } from "@/hooks/use-create-folders";
import React from "react";

type Props = { workspaceId: string };

const CreateFolders = ({ workspaceId }: Props) => {
  const { onCreateNewFolder } = useCreateFolders(workspaceId);
  return (
    <Button
      variant="outline"
      onClick={onCreateNewFolder}
      className="bg-transparent text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl"
    >
      <FolderPlusDuotine />
      Create A folder
    </Button>
  );
};

export default CreateFolders;
