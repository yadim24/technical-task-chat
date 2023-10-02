import {FC} from "react";
import styles from "./Likes.module.css";

type Props = {
  likes: number;
};

export const Likes: FC<Props> = ({likes}) => {
  return (
    <div className={styles["total-likes-wrapper"]}>
      <img src="heart.svg" alt="like" />
      <div className={styles["total-likes"]}>{likes}</div>
    </div>
  );
};
