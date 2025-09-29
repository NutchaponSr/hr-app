import { Employee } from "@/generated/prisma";

import { UserAvatar } from "./user-avatar";
import { CardProfile } from "./card-profile";

interface Props {
  employee: Employee;
}

export const UserProfile = ({ employee } :Props) => {
  return (
    <CardProfile employee={employee}>
      <div className="select-none relative text-sm overflow-hidden items-center flex min-h-8">
        <div className="shrink-0 grow-0 me-1.5 mt-0">
          <UserAvatar
            name={employee.fullName}
            className={{
              container: "size-5",
              fallback: "text-xs font-normal"
            }}
          />
        </div>
        <div className="text-primary leading-[1.5] break-words whitespace-nowrap text-ellipsis overflow-hidden">
          {employee.fullName}
        </div>
      </div>
    </CardProfile>
  );
}