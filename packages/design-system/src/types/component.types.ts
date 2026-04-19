import type { HTMLAttributes } from "react";

export interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export interface ToasterProps {
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
}

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "aside" | "main" | "header" | "footer" | "nav";
}
