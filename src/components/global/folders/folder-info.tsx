"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getFolderInfo } from "@/actions/workspace";

type Props = {
  folderId: string;
};

const FolderInfo = ({ folderId }: Props) => {
  const { data } = useQuery({
    queryKey: ["folder-info"],
    queryFn: () => getFolderInfo(folderId),
  });

  return (
    <div className="flex items-center">
      <h2 className="text[#BdBdBd] text-2xl">{data?.folder?.name}</h2>
    </div>
  );
};

export default FolderInfo;
