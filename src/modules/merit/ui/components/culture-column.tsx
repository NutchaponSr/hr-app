import { OrganizationCulture } from "@/types/kpi";
import { ColumnDef } from "@tanstack/react-table";
import { CultureCellInput } from "./culture-cell-input";

export const columns: ColumnDef<OrganizationCulture>[] = [
  {
    id: "action",
  },
  {
    accessorKey: "cultureCode",
    header: "Code",
    cell: ({ row }) => (
      <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2 min-h-9">
        <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-all inline font-medium text-sm text-primary">
            {row.original.cultureCode}
          </div>
        </div>
      </button>
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
      <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
            {row.original.cultureName}
          </div>
        </div>
      </button>
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
      <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal inline font text-sm text-primary">
            {row.original.description}
          </div>
        </div>
      </button>
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
      <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2">
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
      </button>
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
      <CultureCellInput
        fieldName="evidence"
        data={row.original.evidence}
        variant={column.columnDef.meta!.variant}
        width={column.columnDef.meta?.width}
        id={row.original.id}
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-normal inline font text-sm text-primary">
              {value}
            </div>
          </div>
        )}
      </CultureCellInput>
    ),
    meta: {
      width: "240px",
      variant: "text"
    },
  },
  {
    id: "weight",
    header: "Weight",
    cell: () => (
      <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal inline font text-sm text-primary">
            6
          </div>
        </div>
      </button>
    ),
    meta: {
      width: "100px",
      variant: "numeric",
    },
  },
]