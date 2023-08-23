import React from "react";
import "./button.less";

type Props = {
  children: any;
  className?: string;
  onClick?: () => void;
};

export const Button = ({ children, className, onClick }: Props) => {
  return (
    <button className={"button " + className} onClick={onClick}>
      {children}
    </button>
  );
};
