'use client'

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (path: string) =>
  `${basePath}${path.startsWith("/") ? path : `/${path}`}`;

import { forwardRef, useEffect, useState } from "react";

export const BasePathImg = forwardRef<
  HTMLImageElement,
  React.ComponentPropsWithoutRef<"img">
>(({ src, ...props }, ref) => {
  const [basePath, setBasePath] = useState(process.env.NEXT_PUBLIC_BASE_PATH ?? "");

  useEffect(() => {
    console.log(process.env);
    setBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  }, []);

  const resolvedSrc =
    typeof src === "string"
      ? `${basePath}${src.startsWith("/") ? src : `/${src}`}`
      : src;

  return <img ref={ref} src={resolvedSrc} {...props} />;
});
