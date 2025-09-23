import { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { MeritSchema } from "@/modules/merit/schema";
import { CompetencyItem } from "./comptency-item";
import { FormGenerator } from "@/components/form-generator";
import { CommentPopover } from "@/modules/comments/ui/components/comment-popover";
import { useCommentMerit } from "@/modules/comments/api/use-comment-merit";
import { useMeritId } from "../../hooks/use-merit-id";

interface Props {
  canPerform: boolean;
  form: UseFormReturn<MeritSchema>;
  fields: FieldArrayWithId<MeritSchema, "competencies", "fieldId">[];
}

export const CompetencyTable = ({ form, fields, canPerform }: Props) => {
  const id = useMeritId();

  const { mutation: commentMerit } = useCommentMerit(id);

  return (
    <table className="mt-0 table-fixed border-collapse min-w-full">
      <thead>
        <tr>
          <th rowSpan={2} className="sticky top-9 z-4 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07),inset_0_-1.25px_0_rgba(42,28,0,0.07)] border-r-[1.25px] border-border w-[17%]">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Competency
              </div>
            </div>
          </th>
          <th rowSpan={2} className="sticky top-9 z-4 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07),inset_0_-1.25px_0_rgba(42,28,0,0.07)] border-r-[1.25px] border-border w-[8%]">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Weight
              </div>
            </div>
          </th>
          <th colSpan={5} className="sticky top-9 z-4 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07)] border-r-[1.25px] border-border w-[60%]">
            <div className="flex items-center justify-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Expected Level
              </div>
            </div>
          </th>
          <th rowSpan={2} className="sticky top-9 z-4 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07),inset_0_-1.25px_0_rgba(42,28,0,0.07)] w-[15%]">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Plan & Target
              </div>
            </div>
          </th>
        </tr>
        <tr>
          {Array.from({ length: 5 }).map((_, index) => (
            <th key={index} className="sticky top-17 z-4 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07),inset_0_-1.25px_0_rgba(42,28,0,0.07)] border-r-[1.25px] border-border w-[12%]">
              <div className="flex items-center h-full">
                <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                  Level {index + 1}
                </div>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fields.map((field, index) => (
          <tr
            key={index}
            className="relative h-px border-b-[1.25px] border-border group"
          >
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[17%]">
              <CompetencyItem 
                form={form}
                index={index}
                types={field.types}
                label={field.label}
                canPerform={!canPerform}
              />
            </td>
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[8%]">
              <FormGenerator 
                form={form}
                name={`competencies.${index}.weight`}
                variant="numeric"
                disabled={!canPerform}
                className={{
                  form: "self-start grow",
                }}
              />
            </td>
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[10%]">
              {field.t1}
            </td>
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[10%]">
              {field.t2}
            </td>
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[10%]">
              {field.t3}
            </td>
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[10%]">
              {field.t4}
            </td>
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[10%]">
              {field.t5}
            </td>
            <td className="align-top px-3 py-2 border-border w-[15%]">
              <div className="flex flex-col gap-1.5">
                <FormGenerator 
                  form={form}
                  variant="text"
                  label="Input"
                  disabled={!canPerform}
                  name={`competencies.${index}.input`}
                />
                <FormGenerator 
                  form={form}
                  variant="text"
                  label="Output"
                  disabled={!canPerform}
                  name={`competencies.${index}.output`}
                />
              </div>
              <div className="absolute top-1 -right-8 shadow-[0_0_0_1px_rgba(84,72,49,0.08)] dark:shadow-[0_0_0_1px_rgb(48,48,46)] rounded-sm p-0.5 bg-background">
                <CommentPopover 
                  onCreate={(content) => commentMerit({ content, connectId: field.id })}
                  comments={field.comments}
                  canPerform
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}