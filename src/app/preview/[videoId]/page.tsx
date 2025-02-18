import { getUserProfile, getVideoComments } from "@/actions/user";
import { getPreviewVideo } from "@/actions/workspace";
import VideoPreview from "@/components/global/videos/preview";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

type Props = {
  params: {
    videoId: string;
  };
};

const PreviewVideoPage = async ({ params: { videoId } }: Props) => {
  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["preview-video"],
    queryFn: () => getPreviewVideo(videoId),
  });
  await query.prefetchQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  await query.prefetchQuery({
    queryKey: ["video-comments"],
    queryFn: () => getVideoComments(videoId),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="p-10">
        <VideoPreview videoId={videoId} />
      </div>
    </HydrationBoundary>
  );
};

export default PreviewVideoPage;
