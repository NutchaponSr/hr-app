import { Card, CardInfo } from "@/components/card";
import { CultureWithInfo } from "../../type";
import { convertAmountFromUnit } from "@/lib/utils";
import { useReactTable } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";
import { UseFormReturn } from "react-hook-form";
import { MeritEvaluationSchema } from "../../schema";
import { createColumns } from "./culture-result-columns";
import { useMemo } from "react";
import { Table } from "@/components/table";
import { usePeriod } from "@/hooks/use-period";
import { Period } from "@/generated/prisma";
import { FormGenerator } from "@/components/form-generator";
import { FormField, FormItem } from "@/components/ui/form";
import { SelectionBadge } from "@/components/selection-badge";
import { AttachButton } from "@/components/attach-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useMeritId } from "../../hooks/use-merit-id";

interface Props {
  index: number;
  form: UseFormReturn<MeritEvaluationSchema>;
  record: CultureWithInfo;
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
  },
  hasChecker: boolean;
}

export const CultureCard = ({ index, form, record, permissions, hasChecker }: Props) => {
  const trpc = useTRPC();
  const id = useMeritId();
  const queryClient = useQueryClient();
  
  const { period } = usePeriod();

  const deleteCompetencyFile = useMutation(trpc.kpiMerit.deleteCompetencyFile.mutationOptions());

  const resultEva1st = record.cultureEvaluations.find((evaluation) => evaluation.period === Period.EVALUATION_1ST);
  const resultEva2nd = record.cultureEvaluations.find((evaluation) => evaluation.period === Period.EVALUATION_2ND);

  const resultPopulated = useMemo(() => {
    return [
      {
        round: "1",
        result: resultEva1st?.result,
        owner: resultEva1st?.levelBehaviorOwner,
        checker: resultEva1st?.levelBehaviorChecker,
        approver: resultEva1st?.levelBehaviorApprover,
        weight: record.weight,
        period: Period.EVALUATION_1ST,
      },
      {
        round: "2",
        result: resultEva2nd?.result,
        owner: resultEva2nd?.levelBehaviorOwner,
        checker: resultEva2nd?.levelBehaviorChecker,
        approver: resultEva2nd?.levelBehaviorApprover,
        weight: record.weight,
        period: Period.EVALUATION_2ND,
      },
    ]
  }, [resultEva1st, resultEva2nd, record.weight]);

  const columns = useMemo(() => {
    return createColumns({
      form, 
      permissions,
      index,
      period,
      hasChecker,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form,
    permissions.canPerformOwner,
    permissions.canPerformChecker,
    permissions.canPerformApprover,
    index,
    period,
  ]);

  const table = useReactTable({
    data: resultPopulated,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  return (
    <Card className="p-4 h-max">
      <div className="w-full relative z-80 flex flex-col gap-4">
        <div className="grid grid-cols-7 gap-4">
          <CardInfo label="Culture" className="col-span-2 h-auto">
            <div className="relative w-auto flex flex-col gap-2 items-center px-2.5 py-2">
              <p className="max-w-full w-full whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {record.culture?.name}
              </p>
                <div className="italic underline-offset-[1.25px] [word-break:break-word] whitespace-break-spaces overflow-hidden text-ellipsis text-sm text-danger leading-5">
                {`"${record.culture?.description}"`}
              </div>
            </div>
          </CardInfo>
          <CardInfo label="Behavior" className="col-span-2 h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-full whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {Array.isArray(record.culture?.belief) ? record.culture?.belief?.map((item, idx) => (
                  <li className="list-disc list-inside text-primary" key={idx}>{String(item)}</li>
                )) : null}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="Evidence" className="col-span-2 h-auto">
            <div className="relative w-full flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {record.evidence}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="น้ำหนัก (%)" className="col-span-1 h-auto">
            <div className="relative w-full flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {convertAmountFromUnit(record.weight, 2).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </p>
            </div>
          </CardInfo>
        </div>

        <Table table={table} last={1} variant="primary" />

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
                        รายละเอียดของผลสำเร็จเพิ่มเติม (Detail of success result)
                      </p>
                    </div>

                    <FormGenerator 
                      form={form}
                      name={`cultures.${index}.actualOwner`}
                      variant="text"
                      disabled={!permissions.canPerformOwner}
                      className={{
                        input: "bg-background",
                      }}
                    />

                    <FormField
                      control={form.control}
                      name={`cultures.${index}.fileUrl`}
                      render={({ field }) => (
                        <FormItem className="grow w-full flex flex-col gap-1">
                          <p className="text-xs text-tertiary">(Optional)</p>
                          <AttachButton
                            value={field.value as string | null}
                            canPerform={!permissions.canPerformOwner}
                            onChange={field.onChange}
                            onRemove={() => {
                              deleteCompetencyFile.mutate({
                                id: record.cultureEvaluations[0].id,
                              }, {
                                onSuccess: () => {
                                  queryClient.invalidateQueries(
                                    trpc.kpiMerit.getByFormId.queryOptions({ id, period })
                                  );
                                }
                              })
                            }}
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
                      name={`cultures.${index}.actualChecker`}
                      variant="text"
                      disabled={!permissions.canPerformChecker}
                      className={{
                        form: "grow",
                        input: "min-h-10 max-h-full",
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
                      name={`cultures.${index}.actualApprover`}
                      variant="text"
                      disabled={!permissions.canPerformApprover}
                      className={{
                        form: "grow",
                        input: "min-h-10 max-h-full",
                      }}
                    />
                  </div>
                </Card>
              </td>
              <td className="w-[10%] p-1.5">
                <Card className="px-2.5 py-2 h-auto">
                  <div className="w-full h-full relative z-80 flex flex-col gap-4">
                    <h3 className="text-sm font-medium text-primary">
                      % ผลสำเร็จ
                    </h3>

                    <SelectionBadge 
                      label={(Number(form.watch(`cultures.${index}.levelBehaviorApprover`)) / 100 * convertAmountFromUnit(record.weight, 2)).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
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
}