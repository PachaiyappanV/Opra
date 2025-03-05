"use client";

import { WorkSpace } from "@prisma/client";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  workspace: WorkSpace;
};

const GlobalHeader = ({ workspace }: Props) => {
  //Pathname
  const pathName = usePathname().split(`/dashboard/${workspace.id}`)[1];
  return (
    <article className="flex flex-col gap-2">
      <span className="text-[#707070] text-xs">
        {pathName.includes("video") ? "" : workspace.type.toLocaleUpperCase()}
      </span>
      <h1 className="text-4xl font-semibold">
        {pathName && !pathName.includes("folder") && !pathName.includes("video")
          ? pathName.charAt(1).toUpperCase() + pathName.slice(2).toLowerCase()
          : pathName.includes("video")
          ? ""
          : `${workspace.type === "PERSONAL" ? "My library" : workspace.name}`}
      </h1>
    </article>
  );
};

export default GlobalHeader;
