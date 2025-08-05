import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

// TODO: tRPC procedure

export const usePermission = () => {
  const query = useQuery({
    queryKey: ["user-permission"],
    queryFn: async () => {
      try {
        const res = await authClient.admin.hasPermission({
          permission: {
            backend: ["access"],
          },
        });

        return res;
      } catch (error) {
        console.error("Error checking permissions:", error);
        throw error;
      }
    },
  });

  return query;
}