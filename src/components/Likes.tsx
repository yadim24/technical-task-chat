import {FC, useContext} from "react";
import {LikeStateContext} from "src/contexts/LikeStateContext";
import {invariant} from "src/lib/invariant";
import styles from "./Likes.module.css";

type Props = {
  likes: number;
  id: number;
};

type Variant = "empty" | "filled";

export const Likes: FC<Props> = ({likes, id}) => {
  const likeComponent = {
    empty: <img className={styles.heart} src="emptyHeart.svg" alt="heart" />,
    filled: <img className={styles.heart} src="filledHeart.svg" alt="heart" />,
  };

  const context = useContext(LikeStateContext);
  invariant(context != null, "Не подключен провайдер!");
  const [likeComment, setLikeComment] = context;

  const likedComment = likeComment.find((item) => item === id);

  let variant: Variant = "empty";
  let currentLikes = likes;

  if (likedComment) {
    variant = "filled";
    currentLikes += 1;
  }

  const onLikeClick = () => {
    if (likedComment) {
      const newLikeList = likeComment.filter((item) => item !== likedComment);
      setLikeComment(newLikeList);
    } else {
      setLikeComment([...likeComment, id]);
    }
  };

  return (
    <div className={styles["likes-wrapper"]}>
      <button className={styles.liked} onClick={onLikeClick}>
        {likeComponent[variant]}
      </button>
      <div className={styles["likes"]}>{currentLikes}</div>
    </div>
  );
};
