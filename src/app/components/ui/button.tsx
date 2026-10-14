import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@commons/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98]",
        rgb:
          "bg-gradient-rgb-cta text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/35 active:scale-[0.98]",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.98]",
        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        destructive:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
