import { Card, CardInfo } from "@/components/card";
import { KpiWithEvaluation } from "../../types";
import { UseFormReturn } from "react-hook-form";
import { KpiBonusEvaluationsSchema } from "../../schema";
import { kpiCategoies } from "../../constants";
import { convertAmountFromUnit } from "@/lib/utils";
import { createColumns } from "./kpi-target-columns";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table } from "@/components/table";
import { useMemo } from "react";
import { FormGenerator } from "@/components/form-generator";
import { KpiAttachButton } from "./kpi-attach-button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectionBadge } from "@/components/selection-badge";

interface Props {
  index: number;
  kpi: KpiWithEvaluation;
  form: UseFormReturn<KpiBonusEvaluationsSchema>;
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
  };
}

export const KpiItem = ({ form, index, kpi, permissions }: Props) => {
  const targetPopulated = useMemo(() => {
    return [
      {
        id: "70",
        title: "< 70%",
        detail: kpi.target70,
      },
      {
        id: "80",
        title: "> 70% <= 80%",
        detail: kpi.target80,
      },
      {
        id: "90",
        title: "> 80% <= 90%",
        detail: kpi.target90,
      },
      {
        id: "100",
        title: "> 90% <= 100%",
        detail: kpi.target100,
      },
    ];
  }, [kpi.target70, kpi.target80, kpi.target90, kpi.target100]);

  const table = useReactTable({
    data: targetPopulated,
    columns: createColumns({ form, index, permissions, kpi }),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="p-4 h-max">
      <div className="w-full relative z-80 flex flex-col gap-4">
        <div className="grid grid-cols-5 gap-4">
          <CardInfo label="Individual KPI" className="h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {kpiCategoies[kpi.category!]}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="ตัวชี้วัดการดำเนินงานหลัก" className="h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {kpi.name}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="ความหมายและสูตรคำนวณ" className="h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {kpi.definition}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="แหล่งข้อมูลที่ใช้วัดผลลัพธ์" className="h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {kpi.method}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="น้ำหนัก (%)" className="h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {convertAmountFromUnit(kpi.weight, 2).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </CardInfo>
        </div>

        <div>
          <Table table={table} last={1} variant="primary" showFooter />
          <div>
            <FormField
              control={form.control}
              name={`evaluations.${index}.achievementOwner`}
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`evaluations.${index}.achievementChecker`}
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`evaluations.${index}.achievementApprover`}
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <table className="bg-sidebar rounded">
          <tbody>
            <tr className="flex seft-start">
              <td className="w-[40%] p-1.5 shrink-0">
                <Card className="px-2.5 py-2 h-auto">
                  <div className="w-full h-full relative z-80 flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-primary">
                        Employee
                      </h3>
                      <p className="text-xs text-tertiary">
                        รายละเอียดของผลสำเร็จเพิ่มเติม (Detail of success
                        result)
                      </p>
                    </div>

                    <FormGenerator
                      form={form}
                      name={`evaluations.${index}.actualOwner`}
                      variant="text"
                      disabled={!permissions.canPerformOwner}
                    />

                    <FormField
                      control={form.control}
                      name={`evaluations.${index}.fileUrl`}
                      render={({ field }) => (
                        <FormItem className="grow w-full flex flex-col gap-1">
                          <FormLabel className="text-xs text-tertiary">
                            (Optional)
                          </FormLabel>
                          <KpiAttachButton
                            id={kpi.id}
                            value={field.value as string | null}
                            onChange={field.onChange}
                            canPerform={!permissions.canPerformOwner}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </td>
              <td className="w-[25%] p-1.5">
                <Card className="px-2.5 py-2 h-auto">
                  <div className="w-full h-full relative z-80 flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-primary">
                        Checker
                      </h3>
                      <p className="text-xs text-tertiary">
                        ความคิดเห็น (Comment)
                      </p>
                    </div>

                    <FormGenerator
                      form={form}
                      name={`evaluations.${index}.actualChecker`}
                      variant="text"
                      disabled={!permissions.canPerformChecker}
                      className={{
                        input: "min-h-10 max-h-full",
                        form: "grow",
                      }}
                    />
                  </div>
                </Card>
              </td>
              <td className="w-[25%] p-1.5">
                <Card className="px-2.5 py-2 h-auto">
                  <div className="w-full h-full relative z-80 flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-primary">
                        Approver
                      </h3>
                      <p className="text-xs text-tertiary">
                        ความคิดเห็น (Comment)
                      </p>
                    </div>

                    <FormGenerator
                      form={form}
                      name={`evaluations.${index}.actualApprover`}
                      variant="text"
                      disabled={!permissions.canPerformApprover}
                      className={{
                        input: "min-h-10 max-h-full",
                        form: "grow",
                      }}
                    />
                  </div>
                </Card>
              </td>
              <td className="w-[10%] p-1.5">
                <Card className="px-2.5 py-2 h-auto">
                  <div className="w-full relative z-80 flex flex-col gap-4">
                    <h3 className="text-sm font-medium text-primary">
                      % ผลสำเร็จ
                    </h3>

                    <SelectionBadge
                      label={(
                        (Number(
                          form.watch(
                            `evaluations.${index}.achievementApprover`,
                          ),
                        ) /
                          100) *
                        convertAmountFromUnit(kpi.weight, 2)
                      ).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                      color="orange"
                    />
                  </div>
                </Card>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};
