'use client'

export const basePath = process.env.basePath ?? "";

export const withBasePath = (path: string) =>
  `${basePath}${path.startsWith("/") ? path : `/${path}`}`;

import { forwardRef, useEffect, useState } from "react";

export const BasePathImg = forwardRef<
  HTMLImageElement,
  React.ComponentPropsWithoutRef<"img">
>(({ src, ...props }, ref) => {
  const [basePath, setBasePath] = useState(process.env.basePath ?? "");

  useEffect(() => {
    console.log(process.env.basePath);
    setBasePath(process.env.basePath ?? "");
  }, []);

  const resolvedSrc =
    typeof src === "string"
      ? `${basePath}${src.startsWith("/") ? src : `/${src}`}`
      : src;

  return <img ref={ref} src={resolvedSrc} {...props} />;
});
