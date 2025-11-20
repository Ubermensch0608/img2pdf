import { ElementType } from "react";
import { twMerge } from "tailwind-merge";

type CommonProps = {
  children?: React.ReactNode;
  className?: string;
  as?: ElementType;
};

type ButtonProps = {
  type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

type AnchorButtonProps = {
  as: "a";
  href: string;
  download?: string;
};

type LabelButtonProps = {
  as: "label";
  htmlFor?: string;
};

export const Button = ({
  as = "button",
  children,
  className,
  ...rest
}: CommonProps & (ButtonProps | AnchorButtonProps | LabelButtonProps)) => {
  const Component = as === "button" ? "button" : "label";

  return (
    <Component
      className={twMerge(
        "w-fit bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
