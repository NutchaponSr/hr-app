import { CellInput } from "@/components/cell-input";
import { convertAmountFromUnit } from "@/lib/utils";
import { InputVariants } from "@/types/inputs";
import { OrganizationCulture } from "@/types/kpi";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<OrganizationCulture>[] = [
  {
    id: "action",
  },
  {
    accessorKey: "cultureCode",
    header: "Code",
    cell: ({ row }) => (
      <div role="button" className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2 min-h-9">
        <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-all inline font-medium text-sm text-primary">
            {row.original.cultureCode}
          </div>
        </div>
      </div>
    ),
    meta: {
      width: "100px",
      variant: "text"
    }
  },
  {
    accessorKey: "cultureName",
    header: "Name",
    cell: ({ row }) => (
      <div role="button" className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
            {row.original.name}
          </div>
        </div>
      </div>
    ),
    meta: {
      width: "200px",
      variant: "main"
    }
  },
  {
    accessorKey: "description",
    header: "Definition",
    cell: ({ row }) => (
      <div role="button" className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal inline font text-sm text-primary">
            {row.original.description}
          </div>
        </div>
      </div>
    ),
    meta: {
      width: "500px",
      variant: "text"
    },
  },
  {
    accessorKey: "beliefs",
    header: "Belief",
    cell: ({ row }) => (
      <div role="button" className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <ul className="leading-[1.5] whitespace-pre-wrap break-normal inline font text-sm text-primary">
            {row.original.beliefs.map((item, index) => (
              <li key={index}>
                {index + 1}.  
                {" " + item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    meta: {
      width: "420px",
      variant: "text"
    },
  },
  {
    accessorKey: "evidence",
    header: "Evidence",
    cell: ({ row, column }) => (
      <CellInput
        perform
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.evidence}
        modelType="culture"
        fieldName="evidence"
        name="evidence"
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-normal inline font text-sm text-primary">
              {value}
            </div>
          </div>
        )}
      </CellInput>
    ),
    meta: {
      width: "240px",
      variant: "text"
    },
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => (
      <div role="button" className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal inline font text-sm text-primary">
            {Number(convertAmountFromUnit(row.original.weight, 2)).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    ),
    meta: {
      width: "100px",
      variant: "numeric",
      calculateType: "sum",
    },
  },
]