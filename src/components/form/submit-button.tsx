"use client";
import clsx from "clsx";
import { LucideLoaderCircle } from "lucide-react";
import { cloneElement } from "react";
import { Button } from "../ui/button";
import { useFormPending } from "./form-context";

export type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactElement<{ className?: string }>;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  size?: "sm" | "default" | "lg" | "icon";
  disabled?: boolean;
};

const SubmitButton = ({
  label,
  icon,
  variant = "default",
  size = "default",
  disabled = false,
}: SubmitButtonProps) => {
  const isPending = useFormPending();
  const iconElement = icon
    ? cloneElement(icon, {
        className: clsx("h-4 w-4", icon.props.className),
      })
    : null;
  return (
    <Button
      type="submit"
      disabled={isPending || disabled}
      variant={variant}
      size={size}
    >
      {isPending && (
        <LucideLoaderCircle
          className={clsx("h-4 w-4 animate-spin", {
            "mr-2": !!label,
          })}
        />
      )}
      {label}
      {isPending ? null : iconElement}
    </Button>
  );
};

export { SubmitButton };
