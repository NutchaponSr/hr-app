"use client";

import { useParams } from "next/navigation";


export const useKpiFormId = () => {
  const params = useParams<{ id: string; }>();

  return params.id;
};