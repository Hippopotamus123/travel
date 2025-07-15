// src/routes/generateRoutes.ts
import { ComponentType } from 'react';

// Define the type for a route object
interface Route {
  path: string;
  Component: ComponentType;
  // Optionally, you can add more metadata like layout, etc.
  // Layout?: ComponentType;
}

// Define the type for the imported modules
interface PageModule {
  default: ComponentType;
  // Optionally, add layout if you're using it
  // layout?: ComponentType;
}

// Use import.meta.glob with proper typing
const pages = import.meta.glob('/src/pages/**/[a-zA-Z0-9]*.tsx', {
  eager: true,
}) as Record<string, PageModule>;

const generateRoutes = (): Route[] => {
  const routes: Route[] = [];

  for (const path in pages) {
    const file = pages[path];
    let routePath = path
      .replace('/src/pages', '') // Remove base path
      .replace(/\.tsx$/, '') // Remove file extension
      .replace(/\/index$/, '') // Handle index files
      .replace(/\[(.*?)\]/g, ':$1'); // Convert [param] to :param for dynamic routes

    // Handle root path
    if (routePath === '') {
      routePath = '/';
    }

    routes.push({
      path: routePath,
      Component: file.default,
      // Optionally, include layout if you're using it
      // Layout: file.layout || null,
    });
  }

  return routes;
};

export default generateRoutes;