import { Card, CardInfo } from "@/components/card";
import { CompetencyWithInfo } from "../../type";
import { convertAmountFromUnit } from "@/lib/utils";
import { useReactTable } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";
import { UseFormReturn } from "react-hook-form";
import { MeritEvaluationSchema } from "../../schema";
import { createColumns } from "./competency-result-columns";
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
import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  index: number;
  form: UseFormReturn<MeritEvaluationSchema>;
  record: CompetencyWithInfo;
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
    canPerform: boolean;
  },
  hasChecker: boolean;
}

export const CompetencyCard = ({ index, form, record, permissions, hasChecker }: Props) => {
  const trpc = useTRPC();
  const id = useMeritId();
  const queryClient = useQueryClient();
  
  const { period } = usePeriod();

  const deleteCompetencyFile = useMutation(trpc.kpiMerit.deleteCompetencyFile.mutationOptions());

  const resultEva1st = record.competencyEvaluations.find((evaluation) => evaluation.period === Period.EVALUATION_1ST);
  const resultEva2nd = record.competencyEvaluations.find((evaluation) => evaluation.period === Period.EVALUATION_2ND);

  const resultPopulated = useMemo(() => {
    return [
      {
        round: "ครั้งที่ 1 (ม.ค. - มิ.ย.)",
        result: resultEva1st?.result,
        owner: resultEva1st?.levelOwner,
        checker: resultEva1st?.levelChecker,
        approver: resultEva1st?.levelApprover,
        weight: record.weight,
        period: Period.EVALUATION_1ST,
      },
      {
        round: "ครั้งที่ 2 (ก.ค. - ธ.ค.)",
        result: resultEva2nd?.result,
        owner: resultEva2nd?.levelOwner,
        checker: resultEva2nd?.levelChecker,
        approver: resultEva2nd?.levelApprover,
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
    <Card className="p-4 h-auto relative" cardNumber={<SelectionBadge label={String(index + 1)} color="red" />}>
      <div className="w-full relative z-80 flex flex-col gap-4">
        <div className="grid grid-cols-7 gap-4">
          <CardInfo label="Competency" className="col-span-2 h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {record.competency?.name}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="แผนงาน/โครงการ ที่จะพัฒนา" className="col-span-2 h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {record.output}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="เป้าหมายที่จะพัฒนา" className="col-span-2 h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {record.input}
              </p>
            </div>
          </CardInfo>
          <CardInfo label="น้ำหนัก (%)" className="col-span-1 h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {convertAmountFromUnit(record.weight, 2).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </p>
            </div>
          </CardInfo>
        </div>

        <div className="grid grid-cols-7 gap-4">
          <CardInfo label="ระดับพฤติกรรมของ competency" className="col-span-2 h-auto">
            <div className="relative w-auto flex items-center px-2.5 py-2">
              <p className="max-w-full w-auto whitespace-pre-wrap [word-break:break-word] grow text-sm leading-[1.5] min-h-6 text-primary">
                {record.competency?.[`t${record.expectedLevel}` as 't1' | 't2' | 't3' | 't4' | 't5'] as string | null}
              </p>
            </div>
          </CardInfo>

          <div className="col-span-5 h-auto">
            <Table table={table} last={1} variant="primary" />
          </div>
        </div>

        <table className="bg-sidebar rounded">
          <tbody>
            <tr className="flex seft-start">
              <td className="w-[40%] p-1.5 shrink-0">
                <Card className="px-2.5 py-2 h-auto">
                  <div className="w-full h-full relative z-80 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-start">
                        <h3 className="text-sm font-medium text-primary">
                          Employee
                        </h3>
                        <p className="text-xs text-tertiary">
                          รายละเอียดของผลสำเร็จเพิ่มเติม (Detail of success result)
                        </p>
                      </div>

                      {period === Period.EVALUATION_2ND && (
                        <Popover>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <PopoverTrigger asChild>
                                <Button type="button" variant="ghost" size="iconSm">
                                  <ClockIcon />
                                </Button>
                              </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent className="p-0" sideOffset={4}>
                              <p className="px-2 py-1 text-xs text-white font-medium">
                                Evaluation 1st&apos;s Detail
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <PopoverContent>
                            {record.previousEvaluation.owner ? (
                              <div className="flex flex-col items-start">
                                <p className="text-xs text-primary">
                                  {record.previousEvaluation.owner}
                                </p>
                              </div>
                            ) : null}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    <FormGenerator 
                      form={form}
                      name={`competencies.${index}.actualOwner`}
                      variant="text"
                      disabled={!permissions.canPerformOwner}
                    />

                    <FormField
                      control={form.control}
                      name={`competencies.${index}.fileUrl`}
                      render={({ field }) => (
                        <FormItem className="grow w-full flex flex-col gap-1">
                          <p className="text-xs text-tertiary">(Optional)</p>
                          <AttachButton
                            value={field.value as string | null}
                            canPerform={permissions.canPerform}
                            onChange={field.onChange}
                            onRemove={() => {
                              deleteCompetencyFile.mutate({
                                id: record.competencyEvaluations[0].id,
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
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-start">
                        <h3 className="text-sm font-medium text-primary">
                          Checker
                        </h3>
                        <p className="text-xs text-tertiary">
                          ความคิดเห็น (Comment)
                        </p>
                      </div>

                      {period === Period.EVALUATION_2ND && (
                        <Popover>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <PopoverTrigger asChild>
                                <Button type="button" variant="ghost" size="iconSm">
                                  <ClockIcon />
                                </Button>
                              </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent className="p-0" sideOffset={4}>
                              <p className="px-2 py-1 text-xs text-white font-medium">
                                Evaluation 1st&apos;s Detail
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <PopoverContent>
                            {record.previousEvaluation.owner ? (
                              <div className="flex flex-col items-start">
                                <p className="text-xs text-primary">
                                  {record.previousEvaluation.owner}
                                </p>
                              </div>
                            ) : null}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    <FormGenerator 
                      form={form}
                      name={`competencies.${index}.actualChecker`}
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
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col items-start">
                      <h3 className="text-sm font-medium text-primary">
                        Approver
                      </h3>
                      <p className="text-xs text-tertiary">
                        ความคิดเห็น (Comment)
                      </p>
                      </div>

                      {period === Period.EVALUATION_2ND && (
                        <Popover>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <PopoverTrigger asChild>
                                <Button type="button" variant="ghost" size="iconSm">
                                  <ClockIcon />
                                </Button>
                              </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent className="p-0" sideOffset={4}>
                              <p className="px-2 py-1 text-xs text-white font-medium">
                                Evaluation 1st&apos;s Detail
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <PopoverContent>
                            {record.previousEvaluation.approver ? (
                              <div className="flex flex-col items-start">
                                <p className="text-xs text-primary">
                                  {record.previousEvaluation.approver}
                                </p>
                              </div>
                            ) : null}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    <FormGenerator 
                      form={form}
                      name={`competencies.${index}.actualApprover`}
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
                  <div className="w-full relative z-80 flex flex-col gap-4">
                    <h3 className="text-sm font-medium text-primary">
                      % ผลสำเร็จ
                    </h3>

                    <SelectionBadge 
                      label={(Number(form.watch(`competencies.${index}.levelApprover`)) / 100 * convertAmountFromUnit(record.weight, 2)).toLocaleString("en-US", {
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