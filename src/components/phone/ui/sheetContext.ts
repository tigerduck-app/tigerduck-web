import { createContext, useContext, type ReactNode } from 'react';

export type Detent = 'medium' | 'large';

export interface SheetOptions {
  detents?: Detent[];
  initial?: Detent;
}

export interface Presenter {
  present: (content: ReactNode, options?: SheetOptions) => void;
}

export const PresenterContext = createContext<Presenter>({ present: () => {} });

export function usePresenter(): Presenter {
  return useContext(PresenterContext);
}

/** What a page inside a sheet can ask of the sheet around it. */
export interface InSheet {
  dismiss: () => void;
  expand: () => void;
  isAtLargest: () => boolean;
  /** A pull at the top of the sheet's content, in points, which moves the sheet instead. */
  drag: {
    start: () => void;
    move: (dy: number) => void;
    end: (velocity: number) => void;
  };
}

export const InSheetContext = createContext<InSheet | null>(null);

export function useInSheet(): InSheet | null {
  return useContext(InSheetContext);
}
