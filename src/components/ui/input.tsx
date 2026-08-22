import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border-strong bg-white px-3.5 py-2 text-sm text-text placeholder:text-text-subtle transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-brandRed focus-visible:ring-brandRed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[90px] w-full rounded-lg border border-border-strong bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-subtle transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-brandRed focus-visible:ring-brandRed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-bold text-text leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-brandRed font-bold">*</span>}
    </label>
  )
);
Label.displayName = "Label";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorColor?: string;
}

export function Progress({
  className,
  value = 0,
  max = 100,
  indicatorColor = "bg-primary",
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-[#E8E3DA]",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-500 ease-out", indicatorColor)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
