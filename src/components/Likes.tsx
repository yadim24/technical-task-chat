import {FC} from "react";
import styles from "./Likes.module.css";

type Props = {
  totalLikes: number;
};

export const Likes: FC<Props> = ({totalLikes}) => {
  return (
    <div className={styles["total-likes-wrapper"]}>
      <img src="heart.svg" alt="like" />
      <div className={styles["total-likes"]}>{totalLikes}</div>
    </div>
  );
};
