import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import React from "react";

const InfoBar = () => {
  return (
    <header className="pl-20 md:pl-[265px] backdrop-blur-3xl fixed p-4 w-full flex items-center justify-between gap-4">
      <div className="flex gap-4 justify-center items-center border-2 rounded-full px-4 w-full max-w-lg">
        <Search size={25} className="text-[#707070]" />
        <Input
          className="bg-transparent border-none focus-visible:ring-0  !placeholder-neutral-500 "
          placeholder="Search for people, projects, tags & folders"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="bg-[#E0E0E0] dark:bg-[#1D1D1D] text-[#707070] flex items-center gap-2"
        >
          <VideoRecorderDuotone />
          <span className="flex items-center gap-2">Record</span>
        </Button>
        <UserButton />
      </div>
    </header>
  );
};

export default InfoBar;
