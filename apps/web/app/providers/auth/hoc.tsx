import { ComponentType } from "react";
import { AuthContextType, AuthProvider } from "./context";

export function withAuthProvider<T>(
  WrappedComponent: ComponentType<T>,
): ComponentType<T & AuthContextType> {
  return function (props: T & AuthContextType) {
    return (
      <AuthProvider value={props}>
        <WrappedComponent {...props} />
      </AuthProvider>
    );
  };
}
