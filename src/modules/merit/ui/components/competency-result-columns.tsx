import { UseFormReturn } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";

import { MeritEvaluationSchema } from "@/modules/merit/schema";
import { FormGenerator } from "@/components/form-generator";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Content } from "@/components/content";
import { convertAmountFromUnit } from "@/lib/utils";
import { Period } from "@/generated/prisma";

type CompetencyResult = {
  round: string; 
  result: string | null | undefined;
  owner: number | null | undefined;
  checker: number | null | undefined;
  approver: number | null | undefined;  
  weight: number;
  period: Period;
}

interface Props {
  form: UseFormReturn<MeritEvaluationSchema>;
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
  },
  index: number;
  period: Period;
}

export const createColumns = ({ form, permissions, index, period }: Props): ColumnDef<CompetencyResult>[] => [
  {
    id: "round",
    header: "รอบการประเมิน",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="text-xs text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
          {row.original.round}
        </p>
      </div>
    ),
    meta: {
      width: "w-[10%]",
    },
  },
  {
    id: "result",
    header: "รายละเอียดจากพนักงาน",
    cell: ({ row }) => (
      period === row.original.period ? (
      <FormGenerator 
        form={form}
        name={`competencies.${index}.result`}
        variant="text"
        disabled={!permissions.canPerformOwner}
      />
    ) : (
      <p className="text-xs text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
        {row.original.result}
      </p>
    )),
    meta: {
      width: "w-[45%]",
    },
  },
  {
    id: "employee",
    header: "Employee",
    cell: ({ table, row }) => (
      period === row.original.period ? (
      <FormField
        control={form.control}
        name={`competencies.${index}.levelOwner`}
        render={({ field }) => (
          <FormItem className="grow w-full">
            <Select 
              onValueChange={field.onChange} 
              defaultValue={String(field.value)} 
              disabled={!permissions.canPerformOwner}
            >
              <FormControl>
                <SelectTrigger size="sm" className="w-full">
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                    <SelectValue placeholder="Empty" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
                <SelectItem value="5">Level 5</SelectItem>
              </SelectContent>
            </Select>
            <Content label="Level * Weight">
              <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {(((Number(field.value) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </p>
            </Content>
            <FormMessage />
          </FormItem>
        )}
      />
    ) : (
      <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
        {(((Number(row.original.owner) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}
      </p>
    )),
    meta: {
      width: "w-[15%]",
    },
  },
  {
    id: "Checker",
    header: "Checker",
    cell: ({ table, row }) => (
      period === row.original.period ? (
      <FormField
        control={form.control}
        name={`competencies.${index}.levelChecker`}
        render={({ field }) => (
          <FormItem className="grow w-full">
            <Select 
              onValueChange={field.onChange} 
              defaultValue={String(field.value)} 
              disabled={!permissions.canPerformChecker}
            >
              <FormControl>
                <SelectTrigger size="sm" className="w-full">
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                    <SelectValue placeholder="Empty" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
                <SelectItem value="5">Level 5</SelectItem>
              </SelectContent>
            </Select>
            <Content label="Level * Weight">
              <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {(((Number(field.value) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </p>
            </Content>
            <FormMessage />
          </FormItem>
        )}
      />
    ) : (
      <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
        {(((Number(row.original.checker) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}
      </p>
    )),
    meta: {
      width: "w-[15%]",
    },
  },
  {
    id: "Approver",
    header: "Approver",
    cell: ({ table, row }) => (
      period === row.original.period ? (
      <FormField
        control={form.control}
        name={`competencies.${index}.levelApprover`}
        render={({ field }) => (
          <FormItem className="grow w-full">
            <Select 
              onValueChange={field.onChange} 
              defaultValue={String(field.value)} 
              disabled={!permissions.canPerformApprover}
            >
              <FormControl>
                <SelectTrigger size="sm" className="w-full">
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                    <SelectValue placeholder="Empty" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
                <SelectItem value="5">Level 5</SelectItem>
              </SelectContent>
            </Select>
            <Content label="Level * Weight">
              <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {(((Number(field.value) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </p>
            </Content>
            <FormMessage />
          </FormItem>
        )}
      />
    ) : (
      <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
        {(((Number(row.original.approver) || 0) / table.getRowCount()) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}
      </p>
    )),
    meta: {
      width: "w-[15%]",
    },
  },
];