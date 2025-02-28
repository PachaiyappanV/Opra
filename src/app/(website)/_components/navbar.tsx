import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React from "react";

type Props = {};

const LandingPageNavBar = (props: Props) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        <Image alt="logo" src="/opra-logo.svg" width={40} height={40} />
        Opra
      </div>

      <Link href="/auth/sign-in">
        <Button className="text-base flex gap-x-2 font-semibold">
          <User fill="#000" />
          Login
        </Button>
      </Link>
    </div>
  );
};

export default LandingPageNavBar;
