import { cva } from "class-variance-authority";

export const colorVariant = cva("", 
  {
    variants: {
      text: {
        default: "text-default-muted",
        red: "text-red-muted",
        orange: "text-orange-muted",
        purple: "text-purple-muted",
      },
      background: {
        default: "bg-default-foreground",
        red: "bg-red-foreground",
        orange: "bg-orange-foreground",
        purple: "bg-purple-foreground",
      },
      dot: {
        default: "bg-default",
        red: "bg-red",
        orange: "bg-orange",
        purple: "bg-purple",
      }
    },
  },
);