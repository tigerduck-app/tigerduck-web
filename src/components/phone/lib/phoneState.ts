import { createContext, createElement, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

type State<T> = [T, Dispatch<SetStateAction<T>>];

/**
 * A value held for the life of one phone, as one of the app's stores: a tab's page and the same
 * page pushed from More read and change the one value.
 */
export function phoneState<T>(name: string, initial: () => T) {
  const Context = createContext<State<T> | null>(null);
  function Provider({ children }: { children: ReactNode }) {
    return createElement(Context.Provider, { value: useState(initial) }, children);
  }
  function useValue(): State<T> {
    const value = useContext(Context);
    if (!value) throw new Error(`${name} needs its Provider above it`);
    return value;
  }
  return { Provider, useValue };
}
