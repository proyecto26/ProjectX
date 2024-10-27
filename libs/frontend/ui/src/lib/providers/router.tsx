import { ComponentType } from 'react';
import { createMemoryRouter, RouterProvider, RouteObject } from 'react-router-dom';

export function withRouterProvider<T extends object>(
  WrappedComponent: ComponentType<T>,
): ComponentType<T> {
  return function (props: T) {
    const routes: RouteObject[] = [
      {
        path: '/',
        element: <WrappedComponent {...props} />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/'], // You can set the initial route here
    });

    return <RouterProvider router={router} />;
  };
}