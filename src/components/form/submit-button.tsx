"use client";
import clsx from "clsx";
import { LucideLoaderCircle } from "lucide-react";
import { cloneElement } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

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
  dataTestId?: string;
};

const SubmitButton = ({
  label,
  icon,
  variant = "default",
  size = "default",
  disabled = false,
  dataTestId = "form-submit-button",
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  const iconElement = icon
    ? cloneElement(icon, {
        className: clsx("h-4 w-4", icon.props.className),
      })
    : null;
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      variant={variant}
      size={size}
      data-testid={dataTestId}
    >
      {pending && (
        <LucideLoaderCircle
          className={clsx("h-4 w-4 animate-spin", {
            "mr-2": !!label,
          })}
        />
      )}
      {label}
      {pending ? null : iconElement}
    </Button>
  );
};

export { SubmitButton };
