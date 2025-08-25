import { type ZodType } from "zod";
import { useForm, DefaultValues, FieldValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useZodForm = <
  TValues extends FieldValues,
  TSchema extends ZodType<TValues>
>(
  schema: TSchema,
  defaultValues?: DefaultValues<TValues>,
) => {
  const {
    control,
    register,
    watch,
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<TValues>({
    resolver: (zodResolver as unknown as (schema: unknown) => Resolver<TValues>)(schema),
    defaultValues,
  });

  return {
    control,
    register,
    watch,
    reset,
    setValue,
    getValues,
    handleSubmit,
    errors,
  };
};