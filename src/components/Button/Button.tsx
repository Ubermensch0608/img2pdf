"use client";

import { ElementType, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type CommonProps = {
  children?: React.ReactNode;
  className?: string;
  as?: ElementType;
};

type ButtonProps = {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type AnchorButtonProps = {
  as: "a";
  href: string;
  download?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type LabelButtonProps = {
  as: "label";
  htmlFor?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Button = forwardRef<
  HTMLButtonElement | HTMLLabelElement | HTMLAnchorElement,
  CommonProps & (ButtonProps | AnchorButtonProps | LabelButtonProps)
>(({ as = "button", children, className, ...rest }, ref) => {
  const Component = as;

  return (
    <Component
      className={twMerge(
        "w-fit bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600",
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";
