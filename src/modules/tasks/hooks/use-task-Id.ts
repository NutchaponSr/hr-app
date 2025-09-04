import { useParams } from "next/navigation"

export const useTaskId = () => {
  const params = useParams<{ id: string }>();

  return params.id;
}