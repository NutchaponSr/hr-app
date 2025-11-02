import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";

interface Props {
  name: string;
  position: string;
  division: string;
  department: string;
  weight: number;
}

export const EmployeeEvaluateInfo = ({ 
  name, 
  position, 
  division, 
  department,
  weight 
}: Props) => {
  return (
    <div className="w-full max-w-full self-center px-16">
        <div className="flex flex-col justify-stretch overflow-hidden rounded w-full bg-sidebar dark:bg-[#ffffff0d]">
          <div className="bg-[#2383e224] relative overflow-hidden px-4 py-2.5">
            <div className="flex items-center gap-2">
              <UserAvatar 
                name={name} 
                className={{
                  container: "size-7",
                  fallback: "text-sm font-normal",
                }}
              />
              <div className="text-lg font-semibold text-primary">
                {name}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {/* Position */}
            <div className="my-4 px-4 border-r-[1.25px] border-border">
              <div className="text-xs font-semibold text-primary mb-2">Position</div>
              <div className="text-sm text-tertiary">{position}</div>
            </div>

            {/* Company/Division */}
            <div className="my-4 px-4 border-r-[1.25px] border-border">
              <div className="text-xs font-semibold text-primary mb-2">Company/Division</div>
              <div className="text-sm text-tertiary">{division}</div>
            </div>

            {/* Department/Section */}
            <div className="my-4 px-4 border-r-[1.25px] border-border">
              <div className="text-xs font-semibold text-primary mb-2">Department/Section</div>
              <div className="text-sm text-tertiary">{department}</div>
            </div>

            <div className="my-4 px-4">
              <div className="text-xs font-semibold text-primary mb-2">Weight (%)</div>
              <div className="text-sm text-tertiary">{weight}</div>
            </div>
          </div>
        </div>
      </div>
  );
};