"use client";
import { getPreviewVideo } from "@/actions/workspace";
import { useRouter } from "next/navigation";
import CopyLink from "../copy-link";
import { truncateString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import TabMenu from "../../tabs";
import VideoTranscript from "../../video-transcript";
import RichLink from "../rich-link";
import Activities from "../../activities";
import { sendEmailForFirstView } from "@/actions/user";
import { useEffect } from "react";
import VideoPreviewSkeleton from "./preview-skeleton";
import EditVideo from "../edit";

type Props = {
  videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["preview-video"],
    queryFn: () => getPreviewVideo(videoId),
  });

  useEffect(() => {
    sendEmailForFirstView(videoId);
  }, [videoId]);

  useEffect(() => {
    if (data?.status === 401) {
      router.push("/auth/sign-in");
    }
  }, [data?.status, router]);

  if (isPending) {
    return <VideoPreviewSkeleton />;
  }

  if (data?.status !== 200 || !data?.video) {
    return (
      <div className="flex h-[80vh]  justify-center items-center text-3xl font-bold text-neutral-500">
        Video not found
      </div>
    );
  }

  const daysAgo = Math.floor(
    (new Date().getTime() -
      new Date(data?.video?.createdAt as Date).getTime()) /
      (24 * 60 * 60 * 1000)
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="dark:text-white text-4xl font-bold">
              {data.video.title}
            </h2>
            {data.author ? (
              <EditVideo
                videoId={videoId}
                title={data.video.title as string}
                description={data.video.description as string}
              />
            ) : (
              <></>
            )}
          </div>
          <span className="flex gap-x-3 mt-2">
            <p className="dark:text-[#9D9D9D] capitalize">
              {data.video.User?.firstname} {data.video.User?.lastname}
            </p>
            <p className="text-[#707070]">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        <video
          className="w-full aspect-video rounded-xl"
          preload="metadata"
          controls
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${data.video.source}#1`}
            type="video/mp4"
          />
        </video>
        <div className="flex flex-col text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            <p className="dark:text-[#BDBDBD] text-bold">Description</p>
          </div>
          <p className="text-[#606060] text-lg text-medium">
            {data.video.description}
          </p>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-3 items-center">
          <CopyLink
            variant="outline"
            className="rounded-full bg-transparent px-10"
            videoId={videoId}
          />
          <RichLink
            description={truncateString(data.video.description as string, 150)}
            id={videoId}
            source={data.video.source}
            title={data.video.title as string}
          />
        </div>
        <div>
          <TabMenu
            defaultValue="Transcript"
            triggers={["Transcript", "Activity"]}
          >
            <VideoTranscript transcript={data.video.summery!} />
            <Activities
              author={data.video.User?.firstname as string}
              videoId={videoId}
            />
          </TabMenu>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
