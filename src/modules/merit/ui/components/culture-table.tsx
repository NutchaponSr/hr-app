import { SelectionBadge } from "@/components/selection-badge";
import { MeritSchema } from "@/modules/merit/schema";
import { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { FormGenerator } from "@/components/form-generator";
import { CommentPopover } from "@/modules/comments/ui/components/comment-popover";
import { useMeritId } from "../../hooks/use-merit-id";
import { useCommentMerit } from "@/modules/comments/api/use-comment-merit";

interface Props {
  canPerform: boolean;
  form: UseFormReturn<MeritSchema>;
  fields: FieldArrayWithId<MeritSchema, "cultures", "fieldId">[];
}

export const CultureTable = ({
  form,
  fields,
  canPerform
}: Props) => {
  const id = useMeritId();

  const { mutation: commentMerit } = useCommentMerit(id);

  return (
    <table className="mt-0 table-fixed border-collapse min-w-full">
      <thead>
        <tr>
          <th className="sticky top-9 z-4 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07),inset_0_-1.25px_0_rgba(42,28,0,0.07)] border-r-[1.25px] border-border w-[50%]">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Subject
              </div>
            </div>
          </th>
          <th className="sticky top-9 z-4 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07),inset_0_-1.25px_0_rgba(42,28,0,0.07)] border-r-[1.25px] border-border w-[40%]">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Evidence
              </div>
            </div>
          </th>
          <th className="sticky top-9 z-4 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07),inset_0_-1.25px_0_rgba(42,28,0,0.07)] w-[10%]">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Weight
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field, index) => (
          <tr
            key={index}
            className="relative h-px border-b-[1.25px] border-border group"
          >
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[17%]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <SelectionBadge label={field.code} className="w-3 justify-center items-center text-center" />
                  <div className="whitespace-break-spaces overflow-hidden text-ellipsis text-sm text-primary leading-5">
                    {field.name}
                  </div>
                </div>
                <div className="italic underline underline-offset-[1.25px] [word-break:break-word] whitespace-break-spaces overflow-hidden text-ellipsis text-sm text-danger leading-5">
                  {`"${field.description}"`}
                </div>
              </div>
            </td>
            <td className="align-top px-3 py-2 border-r-[1.25px] border-border w-[8%]">
              <FormGenerator 
                form={form}
                disabled={!canPerform}
                variant="text"
                name={`cultures.${index}.evidence`}
              />
            </td>
            <td className="align-top px-3 py-2 w-[10%]">
              {parseFloat(field.weight).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
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