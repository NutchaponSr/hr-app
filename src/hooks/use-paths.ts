import { usePathname } from "next/navigation";

export const usePaths = () => {
  const pathname = usePathname();

  return pathname.split("/").filter(Boolean);
}