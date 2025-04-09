"use client";
import React from "react";
import Loader from "../loader";
import CardMenu from "./video-card-menu";

import CopyLink from "./copy-link";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, Eye, MessageSquare, User } from "lucide-react";
import { truncateString } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

type Props = {
  User: {
    firstname: string | null;
    lastname: string | null;
    image: string | null;
    clerkid: string;
  } | null;
  id: string;
  Folder: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  title: string | null;
  source: string;
  processing: boolean;
  workspaceId: string;
  views: number;
  _count: {
    Comment: number;
  };
};

const VideoCard = (props: Props) => {
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  const { user } = useUser();

  return (
    <Loader
      className="bg-[#171717] flex justify-center items-center border-[1px] border-[rgb(37,37,37)] rounded-xl"
      state={props.processing}
    >
      <div className="group overflow-hidden cursor-pointer bg-white dark:bg-[#171717] relative border border-neutral-300 dark:border-[#252525] rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        {/* Action Menu - Now has a background overlay */}
        <div className="absolute top-3 right-3 z-30 gap-y-2 hidden group-hover:flex flex-col items-center ">
          <CopyLink videoId={props.id} />
          {props.User?.clerkid === user?.id && (
            <CardMenu
              currentFolderName={props.Folder?.name}
              videoId={props.id}
              currentWorkspace={props.workspaceId}
              currentFolder={props.Folder?.id}
            />
          )}
        </div>

        {/* Video & Content Wrapper */}
        <Link
          href={`/dashboard/${props.workspaceId}/video/${props.id}`}
          className="flex flex-col justify-between h-full transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-[#252525]"
        >
          {/* Video Preview */}
          <video
            controls={false}
            preload="metadata"
            className="w-full aspect-video opacity-80 dark:opacity-60 transition-opacity duration-200"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`}
            />
          </video>

          {/* Video Info */}
          <div className="px-4 py-3 flex flex-col gap-2">
            {/* User Info */}
            <div className="flex gap-x-1 items-center mt-2">
              <Avatar className="w-8 h-8 mr-1">
                <AvatarImage src={props.User?.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>

              <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 capitalize">
                {props.User?.firstname} {props.User?.lastname}
              </p>
              <p className="text-xs text-neutral-700 dark:text-neutral-500 flex items-center">
                <Dot className="w-3 text-sm" />

                {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
              </p>
            </div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-300">
              {props.title && props.title.length > 50
                ? `${truncateString(props.title as string, 50)}`
                : props.title}
            </h2>

            {/* Workspace Info */}
            <div className="mt-2 flex gap-x-4 items-center text-xs text-neutral-500 dark:text-neutral-400">
              <p className="flex items-center gap-x-1">
                <Eye className="w-4 h-4" /> {props.views}
              </p>
              <p className="flex items-center gap-x-1">
                <MessageSquare className="w-4 h-4" /> {props._count.Comment}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </Loader>
  );
};

export default VideoCard;
