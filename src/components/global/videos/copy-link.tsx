import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  videoId: string;
};

const CopyLink = ({ videoId }: Props) => {
  const onCopyClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`
    );
    toast("Copied", {
      description: "Link successfully copied",
    });
  };

  return (
    <div className=" bg-white/80 dark:bg-[#252525]/80 py-[1px] px-[2px]  rounded-[7px] shadow-md">
      <Link2
        onClick={onCopyClipboard}
        size={23}
        className="dark:text-[#b4b3b3]"
      />
    </div>
  );
};

export default CopyLink;
