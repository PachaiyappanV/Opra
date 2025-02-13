import { getFolderInfo, getVideos } from "@/actions/workspace";
import FolderInfo from "@/components/global/folders/folder-info";
import Videos from "@/components/global/videos";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Props = {
  params: {
    folderId: string;
    workspaceId: string;
  };
};

const FolderPage = async ({ params }: Props) => {
  const { folderId, workspaceId } = await params;

  const query = new QueryClient();
  await query.prefetchQuery({
    queryKey: ["folder-info"],
    queryFn: () => getFolderInfo(folderId),
  });

  await query.prefetchQuery({
    queryKey: ["folder-videos"],
    queryFn: () => getVideos(folderId),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <FolderInfo folderId={folderId} />
      <Videos
        workspaceId={workspaceId}
        folderId={folderId}
        videosKey="folder-videos"
      />
    </HydrationBoundary>
  );
};

export default FolderPage;
