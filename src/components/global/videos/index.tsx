"use client";
import { getVideos } from "@/actions/workspace";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";

import { cn } from "@/lib/utils";

import React from "react";
import VideoCard from "./video-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  folderId: string;
  videosKey: string;
  workspaceId: string;
  videosCount?: number;
};

const Videos = ({ folderId, videosKey, workspaceId, videosCount }: Props) => {
  const { data, isPending } = useQuery({
    queryKey: [videosKey],
    queryFn: () => getVideos(folderId),
  });

  return (
    <div className="flex flex-col gap-4 mt-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VideoRecorderDuotone />
          <h2 className="dark:text-[#BdBdBd] text-xl flex  gap-1">
            Videos
            {videosCount! > 0 && (
              <p className="text-[11px] mt-2 rounded-[5px] bg-neutral-500 h-[15px] w-[15px] flex items-center justify-center text-white ">
                {videosCount}
              </p>
            )}
          </h2>
        </div>
      </div>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ">
        {isPending ? (
          <>
            <Skeleton className="w-full h-[250px]" />
            <Skeleton className="w-full h-[250px]" />
            <Skeleton className="w-full h-[250px]" />
            <Skeleton className="w-full h-[250px]" />
          </>
        ) : data?.status === 200 ? (
          data.videos?.map((video) => (
            <VideoCard key={video.id} workspaceId={workspaceId} {...video} />
          ))
        ) : (
          <p className="text-neutral-500"> No videos in workspace</p>
        )}
      </section>
    </div>
  );
};

export default Videos;
