import { UseFormReturn } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";

import { CultureWithInfo } from "@/modules/merit/type";
import { MeritEvaluationSchema } from "@/modules/merit/schema";
import { convertAmountFromUnit } from "@/lib/utils";
import { FormGenerator } from "@/components/form-generator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Content } from "@/components/content";
import { SelectionBadge } from "@/components/selection-badge";
import { CardInfo } from "@/components/card-info";
import { cultureLevels } from "../../constants";

interface Props {
  form: UseFormReturn<MeritEvaluationSchema>
  permissions: {
    canPerformOwner: boolean;
    canPerformChecker: boolean;
    canPerformApprover: boolean;
  },
  hasChecker: boolean;
}

export const createColumns = ({ form, permissions }: Props): ColumnDef<CultureWithInfo>[] => [
  {
    id: "culture",
    header: "Culture",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="self-start mt-1">
            <SelectionBadge label={row.original.culture!.code} className="w-3 justify-center items-center text-center" />
          </div>
          <div className="whitespace-break-spaces overflow-hidden text-ellipsis text-sm text-primary leading-5">
            {row.original.culture!.name}
          </div>
        </div>
        <div className="italic [word-break:break-word] whitespace-break-spaces overflow-hidden text-ellipsis text-sm text-danger leading-5">
          {`"${row.original.culture!.description}"`}
        </div>
      </div>
    ),
    meta: {
      width: "w-[21%]"
    },
  },
  {
    id: "info",
    header: "Info",
    cell: ({ row }) => {
    const belief = row.original.culture?.belief;

    if (Array.isArray(belief)) {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <h5 className="flex items-center leading-4.5 min-w-0 text-xs text-secondary">Behavior</h5>
            <ul className="list-disc list-inside text-primary">
              {belief.map((item, idx) => (
                <li key={idx}>{String(item)}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-0.5">
            <h5 className="flex items-center leading-4.5 min-w-0 text-xs text-secondary">Evidence</h5>
            <p className="[word-break:break-word] whitespace-break-spaces overflow-hidden text-ellipsis text-sm text-primary leading-5">
              {row.original.evidence}
            </p>
          </div>
        </div>
      );
    }
  },
    meta: {
      width: "w-[28%]"
    },
  },
  {
    id: "owner",
    header: "Owner",
    cell: ({ row, table }) => (
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name={`cultures.${row.index}.levelBehaviorOwner`}
          render={({ field }) => (
            <FormItem className="grow w-full">
              <div className="flex items-center gap-0.5">
                <FormLabel>Level</FormLabel>
                <CardInfo data={cultureLevels} />
              </div>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={!permissions.canPerformOwner}>
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
        <FormGenerator 
          form={form}
          label="Actual"
          name={`cultures.${row.index}.actualOwner`}
          disabled={!permissions.canPerformOwner}
          variant="text"
        />
      </div>
    ),
    meta: {
      width: "w-[17%]"
    },
  },
  {
    id: "checker",
    header: "Checker",
    cell: ({ row , table }) => (
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name={`cultures.${row.index}.levelBehaviorChecker`}
          render={({ field }) => (
            <FormItem className="grow w-full">
              <div className="flex items-center gap-0.5">
                <FormLabel>Level</FormLabel>
                <CardInfo data={cultureLevels} />
              </div>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={!permissions.canPerformChecker}>
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
        <FormGenerator 
          form={form}
          label="Actual"
          name={`cultures.${row.index}.actualChecker`}
          disabled={!permissions.canPerformChecker}
          variant="text"
        />
      </div>
    ),
    meta: {
      width: "w-[17%]"
    },
  },
  {
    id: "approver",
    header: "Approver",
    cell: ({ row, table }) => (
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name={`cultures.${row.index}.levelBehaviorApprover`}
          render={({ field }) => (
            <FormItem className="grow w-full">
              <div className="flex items-center gap-0.5">
                <FormLabel>Level</FormLabel>
                <CardInfo data={cultureLevels} />
              </div>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)} disabled={!permissions.canPerformApprover}>
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
        <FormGenerator 
          form={form}
          label="Actual"
          name={`cultures.${row.index}.actualApprover`}
          disabled={!permissions.canPerformApprover}
          variant="text"
        />
      </div>
    ),
    meta: {
      width: "w-[17%]"
    },
  },
  {
    id: "comment",
  },
]