import { cva } from "class-variance-authority";

export const colorVariant = cva("", 
  {
    variants: {
      text: {
        default: "text-gray-muted dark:text-gray-neutral",
        red: "text-red-muted dark:text-red-neutral",
        orange: "text-orange-muted dark:text-orange-neutral",
        purple: "text-purple-muted dark:text-purple-neutral",
        green: "text-green-muted",
      },
      background: {
        default: "bg-gray-foreground",
        red: "bg-red-foreground",
        orange: "bg-orange-foreground",
        purple: "bg-purple-foreground",
        danger: "bg-destructive",
        warning: "bg-warning",
        green: "bg-green-foreground",
      },
      dot: {
        default: "bg-gray",
        red: "bg-red",
        orange: "bg-orange",
        purple: "bg-purple",
        green: "bg-green",
      }
    },
  },
);