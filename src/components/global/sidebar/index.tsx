"use client";
import { getWorkspaces } from "@/actions/workspace";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { NotificationProps, WorkspaceProps } from "@/types/index.type";

import { usePathname, useRouter } from "next/navigation";
import Modal from "../modal";
import { Menu, PlusCircle } from "lucide-react";
import UserSearch from "../search";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/actions/user";
import { MENU_ITEMS } from "@/constants";
import SidebarItem from "./sidebar-item";
import WorkspacePlaceholder from "./workspace-placeholder";
import GlobalCard from "../global-card";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import InfoBar from "../info-bar";
import { useDispatch } from "react-redux";
import { WORKSPACES } from "@/redux/slices/workspaces";
import Image from "next/image";
import PaymentButton from "../payment-button";

type Props = {
  activeWorkspaceId: string;
};
const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();

  const menuItems = MENU_ITEMS(activeWorkspaceId);
  const { data, isFetched } = useQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkspaces(),
  });

  const { user } = data as WorkspaceProps;
  if (isFetched && user) {
    dispatch(WORKSPACES({ workspaces: user.workspace }));
  }

  const { data: notificationData } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });
  const { notifications } = notificationData as NotificationProps;
  const notificationCount = notifications?._count.notification || 0;

  const currentWorkspace = user?.workspace.find(
    (workspace) => workspace.id === activeWorkspaceId
  );

  const onChangeActiveWorkspace = (workSpaceId: string) => {
    router.push(`/dashboard/${workSpaceId}`);
  };

  const SidebarSection = (
    <div className=" bg-[#efffff] dark:bg-[#111111] relative flex-none flex flex-col h-full w-[250px] p-4 gap-4 items-center overflow-hidden">
      <div className=" bg-[#efffff] dark:bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0 ">
        <Image src="/opal-logo.svg" width={40} height={40} alt="logo" />
        <p className="text-2xl">Opal</p>
      </div>

      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 dark:text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent className=" bg-[#efffff] dark:bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {user?.workspace.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
            {user?.members.length > 0 &&
              user.members.map((workspace) => (
                <SelectItem
                  key={workspace.WorkSpace.id}
                  value={workspace.WorkSpace.id}
                >
                  {workspace.WorkSpace.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {currentWorkspace?.type === "PUBLIC" &&
        user.subscription?.plan === "PRO" && (
          <Modal
            title="Invite To Workspace"
            description="Invite other users to your workspace"
            trigger={
              <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90  hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
                <PlusCircle
                  size={15}
                  className="text-neutral-800/90 fill-neutral-500"
                />
                <span className="text-neutral-400 font-semibold text-xs">
                  Invite To Workspace
                </span>
              </span>
            }
          >
            <UserSearch workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              href={item.href}
              icon={item.icon}
              selected={pathName === item.href}
              notifications={
                item.title === "Notifications" ? notificationCount : 0
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full text-[#9D9D9D] font-bold mt-4 ">Workspaces</p>
      {user?.workspace.length === 1 && user?.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {user.subscription?.plan === "FREE"
              ? "Upgrade to create workspaces"
              : "No Workspaces"}
          </p>
        </div>
      )}

      <nav className="w-full">
        <ul
          className={`${
            user?.subscription?.plan === "FREE" ? "h-[60px]" : "h-[150px]"
          } overflow-auto overflow-x-hidden fade-layer`}
        >
          {user?.workspace.map(
            (workspace) =>
              workspace.type !== "PERSONAL" && (
                <SidebarItem
                  key={workspace.id}
                  title={workspace.name}
                  href={`/dashboard/${workspace.id}`}
                  icon={
                    <WorkspacePlaceholder>
                      {workspace.name.charAt(0)}
                    </WorkspacePlaceholder>
                  }
                  selected={pathName === `/dashboard/${workspace.id}`}
                />
              )
          )}
          {user?.members.length > 0 &&
            user.members.map((item) => (
              <SidebarItem
                key={item.WorkSpace.id}
                title={item.WorkSpace.name}
                href={`/dashboard/${item.WorkSpace.id}`}
                icon={
                  <WorkspacePlaceholder>
                    {item.WorkSpace.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
                selected={pathName === `/dashboard/${item.WorkSpace.id}`}
              />
            ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      {user?.subscription?.plan === "FREE" && (
        <GlobalCard
          title="Upgrade to Pro"
          description=" Unlock AI features like transcription, AI summary, and more."
          footer={<PaymentButton />}
        />
      )}
    </div>
  );

  return (
    <div className="">
      <InfoBar />
      <div className="fixed top-[21px] left-6  cursor-pointer lg:hidden ">
        <div className=" hover:bg-[#111111] px-[3px] py-[0.8px] rounded-[3px]">
          <Sheet>
            <SheetTrigger asChild>
              <Menu color="#9D9D9D" size={29} />
            </SheetTrigger>
            <SheetTitle className="hidden">h</SheetTitle>
            <SheetContent side="left" className="p-0 w-fit  h-full">
              {SidebarSection}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="hidden lg:block h-full">{SidebarSection}</div>
    </div>
  );
};

export default Sidebar;
