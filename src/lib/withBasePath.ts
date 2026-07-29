export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (path: string) =>
  `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
