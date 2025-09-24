import { UseFormReturn } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";

import { FormGenerator } from "@/components/form-generator";

import { KpiBonusEvaluationsSchema } from "@/modules/bonus/schema";
import { KpiWithEvaluation } from "@/modules/bonus/types";
import { Content } from "@/components/content";
import { SelectionBadge } from "@/components/selection-badge";
import { kpiCategoies, projectTypes } from "../../constants";
import { convertAmountFromUnit } from "@/lib/utils";
import { FormField, FormLabel, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KpiAttachButton } from "./kpi-attach-button";

interface Props {
  form: UseFormReturn<KpiBonusEvaluationsSchema>;
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
  },
  hasChecker: boolean;
}

export const createColumns = ({ 
  form,
  permissions,
  hasChecker,
}: Props): ColumnDef<KpiWithEvaluation>[] => {
  const columns: ColumnDef<KpiWithEvaluation>[] = [
    {
      id: "kpi",
      header: "KPI Bonus",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2">
              <Content label="Category">
                <SelectionBadge label={kpiCategoies[row.original.category!]} />
              </Content>
            </div>
            <div className="col-span-3">
              <Content label="Name">
                <p className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {row.original.name}
                </p>
              </Content>
            </div>
            <div className="col-span-1 text-primary">
              <Content label="Weight">
                <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {convertAmountFromUnit(row.original.weight, 2).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })} %
                </p>
              </Content>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Content label="Link to Strategy">
                <p className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {row.original.strategy}
                </p>
              </Content>
            </div>
            <div className="col-span-1">
              <Content label="Kpi's type">
                <SelectionBadge label={projectTypes[row.original.type!]} />
              </Content>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Content label="Objective">
              <p className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {row.original.objective}
              </p>
            </Content>
            <Content label="Definition">
              <p className=" text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {row.original.definition}
              </p>
            </Content>
          </div>
          <div className="relative after:absolute after:border-border after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t text-xs text-secondary uppercase text-center my-2">
            <span className="uppercase z-10 bg-background relative px-2">
              target
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Content label="Need Improve (<70%)">
              <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {row.original.target70}
              </p>
            </Content>
            <Content label="Level 2 (80%)">
              <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {row.original.target80}
              </p>
            </Content>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Content label="Level 3 (80%)">
              <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {row.original.target90}
              </p>
            </Content>
            <Content label="Meet expert (100%)">
              <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                {row.original.target100}
              </p>
            </Content>
          </div>
        </div>
      ),
      meta: {
        width: hasChecker ? "w-[40%]" : "w-[50%]", // Adjust width based on hasChecker
      },
    },
    {
      id: "owner",
      header: "Owner",
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name={`evaluations.${row.index}.achievementOwner`}
            render={({ field }) => (
              <FormItem className="grow w-full">
                <FormLabel>Achievement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={permissions.canPerformOwner}>
                  <FormControl>
                    <SelectTrigger size="sm" className="w-full">
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                        <SelectValue placeholder="Empty" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="70">Need Improve ({"<"}70%)</SelectItem>
                    <SelectItem value="80">Level 2 (80%)</SelectItem>
                    <SelectItem value="90">Level 3 (90%)</SelectItem>
                    <SelectItem value="100">Meet Expert(100%)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                <Content label="Achievement (%) * Weight">
                  <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                    {(((Number(field.value) || 0) / 100) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                  </p>
                </Content>
              </FormItem>
            )}
          />
          <FormGenerator
            form={form}
            variant="text"
            label="Actual"
            name={`evaluations.${row.index}.actualOwner`}
            disabled={permissions.canPerformOwner}
          />
          <div className="relative after:absolute after:border-border after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t text-xs text-secondary uppercase text-center">
            <span className="uppercase z-10 bg-background relative px-2">
              or attach with
            </span>
          </div>
          <FormField
            control={form.control}
            name={`evaluations.${row.index}.fileUrl`}
            render={({ field }) => (
              <FormItem className="grow w-full">
                <KpiAttachButton 
                  id={row.original.kpiEvaluations[0].id}
                  value={field.value as string | null} 
                  onChange={field.onChange} 
                  canPerform={permissions.canPerformOwner} 
                />
              </FormItem>
            )}
          />
        </div>
      ),
      meta: {
        width: hasChecker ? "w-[20%]" : "w-[25%]", // Adjust width based on hasChecker
      },
    },
  ];

  // Conditionally add checker column
  if (hasChecker) {
    columns.push({
      id: "checker",
      header: "Checker",
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name={`evaluations.${row.index}.achievementChecker`}
            render={({ field }) => (
              <FormItem className="grow w-full">
                <FormLabel>Achievement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={permissions.canPerformChecker}>
                  <FormControl>
                    <SelectTrigger size="sm" className="w-full">
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                        <SelectValue placeholder="Empty" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="70">Need Improve ({"<"}70%)</SelectItem>
                    <SelectItem value="80">Level 2 (80%)</SelectItem>
                    <SelectItem value="90">Level 3 (90%)</SelectItem>
                    <SelectItem value="100">Meet Expert(100%)</SelectItem>
                  </SelectContent>
                </Select>
                <Content label="Achievement (%) * Weight">
                  <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                    {(((Number(field.value) || 0) / 100) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                  </p>
                </Content>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormGenerator
            form={form}
            variant="text"
            label="Actual"
            name={`evaluations.${row.index}.actualChecker`}
            disabled={permissions.canPerformChecker}
          />
        </div>
      ),
      meta: {
        width: "w-[20%]",
      },
    });
  }

  // Add approver column
  columns.push({
    id: "approver",
    header: "Approver",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name={`evaluations.${row.index}.achievementApprover`}
          render={({ field }) => (
            <FormItem className="grow w-full">
              <FormLabel>Achievement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={permissions.canPerformApprover}>
                <FormControl>
                  <SelectTrigger size="sm" className="w-full">
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                      <SelectValue placeholder="Empty" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="70">Need Improve ({"<"}70%)</SelectItem>
                  <SelectItem value="80">Level 2 (80%)</SelectItem>
                  <SelectItem value="90">Level 3 (90%)</SelectItem>
                  <SelectItem value="100">Meet Expert(100%)</SelectItem>
                </SelectContent>
              </Select>
              <Content label="Achievement (%) * Weight">
                <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {(((Number(field.value) || 0) / 100) * convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </p>
              </Content>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormGenerator
          form={form}
          variant="text"
          label="Actual"
          name={`evaluations.${row.index}.actualApprover`}
          disabled={permissions.canPerformApprover}
        />
      </div>
    ),
    meta: {
      width: hasChecker ? "w-[20%]" : "w-[25%]", // Adjust width based on hasChecker
    },
  });

  // Add comment column
  columns.push({
    id: "comment",
  });

  return columns;
}