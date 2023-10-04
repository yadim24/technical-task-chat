import {createContext} from "react";

type LikeContext =
  | [number[], React.Dispatch<React.SetStateAction<number[]>>]
  | null;

export const LikeStateContext = createContext<LikeContext>(null);
