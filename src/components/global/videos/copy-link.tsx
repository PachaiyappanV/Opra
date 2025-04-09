import { Link2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { ToolTip } from "../tooltip";

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
    <ToolTip
      content="Copy link"
      side="left"
      contentClassName="bg-white dark:bg-black py-[2px] px-[6px] rounded-[7px] shadow-md text-md dark:text-white text-black font-bold"
    >
      <div className=" bg-white dark:bg-black py-[1px] px-[2px]  rounded-[7px] shadow-md">
        <Link2
          onClick={onCopyClipboard}
          size={23}
          className="dark:text-white"
        />
      </div>
    </ToolTip>
  );
};

export default CopyLink;
