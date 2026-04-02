import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoaderButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
}

export function LoaderButton({
  isLoading,
  children,
  disabled,
  ...props
}: LoaderButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
