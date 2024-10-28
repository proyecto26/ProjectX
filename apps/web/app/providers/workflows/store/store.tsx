import React, {
  useReducer,
  createContext,
  PropsWithChildren,
  ComponentType,
  useContext,
} from 'react';

import { initialState, reducer } from './reducer';
import { StoreReducer, ContextProps } from './types';

export const GlobalContext = createContext<ContextProps>(
  [initialState, () => null] as ContextProps,
);
export const StoreConsumer = GlobalContext.Consumer;

export type StoreProviderProps = PropsWithChildren<{
  accessToken?: string;
}>;

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  accessToken,
}) => {
  const [state, dispatch] = useReducer<StoreReducer>(reducer, {
    ...initialState,
    accessToken,
  });

  const value = React.useMemo<ContextProps>(
    () => [state, dispatch],
    [state, dispatch],
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export type StoreProviderType = {
  accessToken?: string;
};

export function withStoreProvider<T>(
  WrappedComponent: ComponentType<T>,
): ComponentType<T & StoreProviderType> {
  return function (props: T & StoreProviderType) {
    return (
      <StoreProvider accessToken={props.accessToken}>
        <WrappedComponent {...props} />
      </StoreProvider>
    );
  };
}

export function useStore() {
  return useContext(GlobalContext);
}

export function useStoreState() {
  return useContext(GlobalContext)?.[0];
}

export function useStoreDispatch() {
  return useContext(GlobalContext)?.[1];
}
