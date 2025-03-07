import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const UserId = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user?.id as string);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy user ID", err);
    }
  };

  return (
    <Button
      variant="outline"
      className="bg-transparent cursor-default text-[#707070] flex items-center gap-2"
    >
      <span className="flex items-center gap-2">User ID</span>
      <span onClick={handleCopy} className="cursor-pointer">
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </span>
    </Button>
  );
};

export default UserId;
