import { createContext, useContext } from 'react';

/** Accessible name for figures: the heading of the card they sit in. */
export const FigureLabelContext = createContext<string | undefined>(undefined);

export const useFigureLabel = () => useContext(FigureLabelContext);
