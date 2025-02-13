"use client";
import { getNotifications } from "@/actions/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";

const Notifications = () => {
  const { data } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  if (data?.status !== 200) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p>No Notifications</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {data.notifications?.notification.map((n) => (
        <div
          key={n.id}
          className="border-2 flex gap-x-3 items-center rounded-lg p-3"
        >
          <Avatar>
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <p>{n.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
