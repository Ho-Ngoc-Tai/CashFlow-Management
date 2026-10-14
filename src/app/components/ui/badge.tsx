import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@commons/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-50 border border-indigo-200 text-indigo-700",
        secondary:
          "bg-slate-100 border border-slate-200 text-slate-700",
        success:
          "bg-emerald-50 border border-emerald-200 text-emerald-700",
        warning:
          "bg-amber-50 border border-amber-200 text-amber-700",
        destructive:
          "bg-rose-50 border border-rose-200 text-rose-700",
        cyan:
          "bg-cyan-50 border border-cyan-200 text-cyan-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
