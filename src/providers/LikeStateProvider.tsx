import {ReactElement, ReactNode, useState} from "react";
import {LikeStateContext} from "src/contexts/LikeStateContext";

export const LikeStateProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const likeCommentWithSetter = useState<number[]>([]);

  return (
    <LikeStateContext.Provider value={likeCommentWithSetter}>
      {children}
    </LikeStateContext.Provider>
  );
};
