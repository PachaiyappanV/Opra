import { getVideos, getWorkspaceFolders } from "@/actions/workspace";
import CreateFolders from "@/components/global/create-folder";
import CreateWorkspace from "@/components/global/create-workspace";
import Folders from "@/components/global/folders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient } from "@tanstack/react-query";

type Props = {
  params: { workspaceId: string };
};

const WorkspacePage = async ({ params }: Props) => {
  const { workspaceId } = await params;

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  await query.prefetchQuery({
    queryKey: ["workspace-videos"],
    queryFn: () => getVideos(workspaceId),
  });

  return (
    <div>
      <Tabs defaultValue="videos" className="mt-6">
        <div className="flex flex-col items-start gap-y-4 sm:flex-row w-full sm:justify-between sm:items-center">
          <TabsList className="bg-transparent gap-2 pl-0">
            <TabsTrigger
              value="videos"
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
            >
              Archive
            </TabsTrigger>
          </TabsList>
          <div className="flex  gap-x-3">
            <CreateWorkspace />
            <CreateFolders workspaceId={workspaceId} />
          </div>
        </div>
        <section className="py-9">
          <TabsContent value="videos">
            <Folders workspaceId={workspaceId} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  );
};

export default WorkspacePage;
