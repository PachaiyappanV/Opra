import { getNotifications, onAuthenticateUser } from "@/actions/user";
import { getWorkspaces, verifyAccessToWorkspace } from "@/actions/workspace";
import GlobalHeader from "@/components/global/global-header";
import Sidebar from "@/components/global/sidebar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: { workspaceId: string };
};

const WorkspaceLayout = async ({ children, params }: Props) => {
  const { workspaceId } = await params;
  const auth = await onAuthenticateUser();
  if (!auth.user?.workspace && !auth.user?.workspace.length) {
    redirect("/auth/sign-in");
  }
  const hasAccess = await verifyAccessToWorkspace(workspaceId);
  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  if (!hasAccess.workspace) return null;

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkspaces(),
  });

  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex w-screen h-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className="w-full p-6 pt-28 overflow-y-scroll overflow-x-hidden ">
          <GlobalHeader workspace={hasAccess.workspace} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default WorkspaceLayout;
