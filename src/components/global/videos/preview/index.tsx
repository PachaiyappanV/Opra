"use client";
import { getPreviewVideo } from "@/actions/workspace";
import { useRouter } from "next/navigation";
import CopyLink from "../copy-link";
import { truncateString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { VideoProps } from "@/types/index.type";
import TabMenu from "../../tabs";
import VideoTranscript from "../../video-transcript";
import RichLink from "../rich-link";
import Activities from "../../activities";

type Props = {
  videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["preview-video"],
    queryFn: () => getPreviewVideo(videoId),
  });

  const { video, status } = data as VideoProps;

  if (status === 401) {
    router.push("/auth/sign-in");
  }
  if (status !== 200) {
    return (
      <div className=" w-screen h-screen justify-center items-center text-2xl font-bold text-neutral-500">
        Video not found
      </div>
    );
  }

  const daysAgo = Math.floor(
    (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3  overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="dark:text-white text-4xl font-bold">
              {video.title}
            </h2>
          </div>
          <span className="flex gap-x-3 mt-2">
            <p className="dark:text-[#9D9D9D] capitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-[#707070]">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        <video
          className="w-full aspect-video  dark:opacity-70 rounded-xl"
          controls
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
            type="video/mp4"
          />
        </video>
        <div className="flex flex-col text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            <p className="dark:text-[#BDBDBD] text-semibold">Description</p>
          </div>
          <p className="text-[#707070] text-lg text-medium">
            {video.description}
          </p>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-3 items-center">
          <CopyLink
            variant="outline"
            className="rounded-full  bg-transparent px-10"
            videoId={videoId}
          />
          <RichLink
            description={truncateString(video.description as string, 150)}
            id={videoId}
            source={video.source}
            title={video.title as string}
          />
        </div>
        <div>
          <TabMenu
            defaultValue="Transcript"
            triggers={["Transcript", "Activity"]}
          >
            <VideoTranscript transcript={video.summery!} />
            <Activities
              author={video.User?.firstname as string}
              videoId={videoId}
            />
          </TabMenu>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
