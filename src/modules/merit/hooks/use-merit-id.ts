"use client";

import { useParams } from "next/navigation";

export const useMeritId = () => {
  const params = useParams<{ id: string; }>();

  return params.id;
}