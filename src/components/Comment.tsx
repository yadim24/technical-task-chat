import {FC} from "react";
import {formatDate} from "src/lib/formatDate";
import styles from "./Comment.module.css";
import {Likes} from "./Likes";

type Props = {
  author: string;
  avatar: string;
  date: string;
  likes: number;
  text: string;
};

export const Comment: FC<Props> = ({author, avatar, date, likes, text}) => {
  return (
    <div className={styles.comment}>
      <div className={styles["comment-data-wrapper"]}>
        <div className={styles["author-wrapper"]}>
          <img className={styles.avatar} src={avatar} alt="Avatar" />
          <div className={styles.author}>
            <div className={styles.name}>{author}</div>
            <div className={styles.created}>
              {formatDate(date, {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </div>
          </div>
        </div>
        <Likes likes={likes} />
      </div>
      <div className={styles.message}>{text}</div>
    </div>
  );
};
