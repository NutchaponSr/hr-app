import { useContext } from "react";

import { InternationalContext } from "@/providers/international-provider";

export const useInternational = () => {
  const context = useContext(InternationalContext);
  
  if (!context) {
    throw new Error("useInternational must be used within InternationalProvider");
  }
  
  return context;
};