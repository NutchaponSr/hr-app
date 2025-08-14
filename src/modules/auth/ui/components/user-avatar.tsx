import { cn } from "@/lib/utils";

import { 
  Avatar,
  AvatarFallback,
  AvatarImage 
} from "@/components/ui/avatar";

interface Props {
  className?: {
    container?: string;
    fallback?: string;
  };
  src?: string;
  name: string;
}

export const UserAvatar = ({ className, src, name }: Props) => {
  const fallback = name.charAt(3).toUpperCase();

  return (
    <Avatar className={cn(className?.container)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={cn(className?.fallback, "bg-marine text-white font-bold")}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}