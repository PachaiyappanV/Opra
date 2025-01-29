import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserSearch } from "@/hooks/use-user-search";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { useState } from "react";
import Loader from "../loader";

type Props = {
  workspaceId: string;
};
const UserSearch = ({ workspaceId }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, isLoading } = useUserSearch(searchQuery);

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        type="text"
        value={searchQuery}
        placeholder="Search for your user..."
        className="bg-transparent border-2 outline-none"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isLoading ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-8 w-full rounded-xl" />
        </div>
      ) : !users.length ? (
        <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
      ) : (
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-x-3 items-center w-full p-3 rounded-xl"
            >
              <Avatar>
                <AvatarImage src={user.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <h3 className="text-bold text-lg capitalize ">
                  {user.firstname} {user.lastname}
                </h3>
                <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e]">
                  {user.subscription?.plan}
                </p>
              </div>
              <div className="flex-1 flex justify-end items-center">
                <Button variant={"default"} className="w-5/12 font-bold">
                  <Loader state={true} color="#000">
                    Invite
                  </Loader>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
