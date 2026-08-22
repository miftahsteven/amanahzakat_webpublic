import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "navy" | "danger" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold font-sans transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow",
      secondary:
        "bg-primary-soft text-primary hover:bg-primary hover:text-white border border-primary-border",
      outline:
        "border border-border-strong bg-white text-text hover:bg-[#F7F5F0] hover:border-text",
      ghost:
        "bg-transparent text-text hover:bg-black/5",
      navy:
        "bg-navy text-white hover:bg-navy-light shadow-sm",
      danger:
        "bg-brandRed text-white hover:bg-red-700",
      link:
        "text-primary hover:underline p-0 h-auto font-semibold bg-transparent",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs rounded-md gap-1.5",
      md: "h-11 px-5 text-sm rounded-md gap-2",
      lg: "h-13 px-7 text-base rounded-lg gap-2.5",
      icon: "h-10 w-10 p-0 rounded-md",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
