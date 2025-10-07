  import { toast } from "sonner";
  import { inferProcedureInput } from "@trpc/server";
  import { useMutation } from "@tanstack/react-query";

  import { useTRPC } from "@/trpc/client";
  import { AppRouter } from "@/trpc/routers/_app";

  type RequestType = inferProcedureInput<AppRouter["kpiMerit"]["export"]>;

  export const useExportMerit = () => {
    const trpc = useTRPC();

    const exportExcel = useMutation(trpc.kpiMerit.export.mutationOptions());

    const mutation = async (value: RequestType) => {
      toast.loading("Exporting...", { id: "export" });

      const res = await exportExcel.mutateAsync({
        ...value,
      }, {
        onSuccess: () => {
          toast.success("Exported!", { id: "export" });
        },
        onError: (ctx) => {
          toast.error(ctx.message || "Something went wrong", { id: "export" });
        },
      });

      const byteCharacters = atob(res.file);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
  
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `merit-export-${res.id}.xlsx`;
      a.click();

      URL.revokeObjectURL(url);
    }

    return { mutation, opt: exportExcel };
  }