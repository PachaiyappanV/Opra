import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  icon: React.ReactNode;
  title: string;
  href: string;
  selected: boolean;
  notifications?: number;
};
const SidebarItem = ({ icon, title, href, selected, notifications }: Props) => {
  return (
    <li className=" cursor-pointer my-[5px]">
      <Link
        href={href}
        className={cn(
          "flex rounded-lg justify-between items-center group hover:bg-[#E0E0E0] dark:hover:bg-[#1D1D1D]",
          selected ? " bg-[#E0E0E0] dark:bg-[#1D1D1D]" : ""
        )}
      >
        <div className="flex  items-center  gap-2 transition-all p-[5px] cursor-pointer">
          {icon}
          <span
            className={cn(
              "font-medium group-hover:text-[#262626] dark:group-hover:text-[#9D9D9D] transition-all truncate w-32",
              selected
                ? "text-[#262626] dark:text-[#9D9D9D]"
                : "text-[#1A1A1A] dark:text-[#545454]"
            )}
          >
            {title}
          </span>
        </div>
        {notifications !== 0 && (
          <span
            className={cn(
              "font-medium  mr-1 transition-all group-hover:bg-[#ffffff] dark:group-hover:bg-[#111111] px-2 rounded-sm text-[#262626] dark:text-[#9D9D9D]",
              selected ? "dark:bg-[#111111]" : " bg-[#E3E3E3] dark:bg-[#1D1D1D]"
            )}
          >
            {notifications}
          </span>
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;
