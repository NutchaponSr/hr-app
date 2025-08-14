import { Table as TB} from "@tanstack/react-table";

import { Table } from "@/layouts/components/table";

import { LayoutVariant } from "@/types/layouts";

interface Props<T> {
  variant: LayoutVariant;
  table: TB<T>;
}

export const LayoutProvider = <T,>({ variant, ...props }: Props<T>) => {
  const layoutMap: Record<LayoutVariant, React.ComponentType<{ table: TB<T> }>> = {
    table: Table,
  }

  const LayoutComponent = layoutMap[variant];

  return <LayoutComponent {...props} />
}