import {FC} from "react";
import {formatDate} from "src/lib/formatDate";
import {pluralize} from "src/lib/pluralize";
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
  const diffTime = (date: string) => {
    const currentTime = new Date();
    const difference = Math.round(
      (currentTime.getTime() - new Date(date).getTime()) / (1000 * 60 * 60),
    );

    if (difference < 24) {
      return `${difference} ${pluralize(difference, [
        "час",
        "часа",
        "часов",
      ])} назад`;
    }

    return formatDate(date, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  return (
    <div className={styles.comment}>
      <div className={styles["comment-data-wrapper"]}>
        <div className={styles["author-wrapper"]}>
          <img className={styles.avatar} src={avatar} alt="Avatar" />
          <div className={styles.author}>
            <div className={styles.name}>{author}</div>
            <div className={styles.created}>{diffTime(date)}</div>
          </div>
        </div>
        <Likes likes={likes} />
      </div>
      <div className={styles.message}>{text}</div>
    </div>
  );
};
