"use client";

import React from "react";
import Modal from "../modal";
import { Button } from "@/components/ui/button";

import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/actions/workspace";
import WorkspaceForm from "@/components/forms/workspace-form";

const CreateWorkspace = () => {
  const { data } = useQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkspaces(),
  });
  const subscription = data?.user?.subscription;

  if (subscription?.plan === "FREE") {
    return <></>;
  }

  if (subscription?.plan === "PRO") {
    return (
      <Modal
        title="Create a Workspace"
        description=" Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself."
        trigger={
          <Button
            variant="outline"
            className=" bg-transparent   text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl"
          >
            <FolderPlusDuotine />
            Create Workspace
          </Button>
        }
      >
        <WorkspaceForm />
      </Modal>
    );
  }
};

export default CreateWorkspace;
