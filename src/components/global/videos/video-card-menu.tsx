import React from "react";
import Modal from "../modal";
import { Ellipsis, Move } from "lucide-react";
import ChangeVideoLocation from "@/components/forms/change-video-location";
import { ToolTip } from "../tooltip";

type Props = {
  videoId: string;
  currentWorkspace?: string;
  currentFolder?: string;
  currentFolderName?: string;
};

const CardMenu = ({
  videoId,
  currentFolder,
  currentFolderName,
  currentWorkspace,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <ToolTip
        content="Move"
        side="left"
        contentClassName="bg-white dark:bg-black py-[2px] px-[6px] rounded-[7px] shadow-md text-md dark:text-white text-black font-bold"
      >
        <div>
          <Modal
            className="flex items-center cursor-pointer gap-x-2  bg-white dark:bg-black py-[4px]  px-[2px] rounded-sm shadow-md"
            title="Move to new Workspace/Folder"
            description="This action cannot be undone."
            trigger={<Move size={27} className="dark:text-white" />}
          >
            <ChangeVideoLocation
              currentFolder={currentFolder}
              currentWorkSpace={currentWorkspace}
              videoId={videoId}
              currentFolderName={currentFolderName}
            />
          </Modal>
        </div>
      </ToolTip>
      <ToolTip
        content="More actions..."
        side="left"
        contentClassName="bg-white dark:bg-black py-[2px] px-[6px] rounded-[7px] shadow-md text-md dark:text-white text-black font-bold"
      >
        <div className=" bg-white dark:bg-black px-[1px] rounded-[7px] shadow-md ">
          <Ellipsis size={25} className="dark:text-white" />
        </div>
      </ToolTip>
    </div>
  );
};

export default CardMenu;
