import { PlusIcon } from "lucide-react";

import { Button } from "./ui/button";
import Link from "next/link";

interface Props {
  message: string | null;
}

export const WarnningBanner = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div data-error={!!message} className="w-full select-none data-[error=true]:block hidden">
      <div className="flex items-center justify-center whitespace-nowrap px-3 text-sm text-white font-medium bg-warning min-h-11">
        <div className="flex items-center justify-center overflow-visible whitespace-normal py-2 px-1">
          {message}
        </div>
        <div className="flex items-center px-3">
          <Button size="sm" variant="outlineWarnning" asChild>
            <Link href="/performance/bonus">
              <PlusIcon className="stroke-[2.5]" />
              KPI Bonus
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}