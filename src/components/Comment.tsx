import styles from "./Comment.module.css";

export const Comment = ({data}) => {
    return (
        <div className={styles.comment}>
            <div className={styles["comment-data-wrapper"]}>
                <div className={styles.avatar}>Картинка</div>
                <div className={styles["author-wrapper"]}>
                    <div className={styles["author"]}>Имя</div>
                    <div className={styles.created}>Дата</div>
                </div>
                <Likes />
            </div>
            <div className={styles.message}>Текст сообщения</div>
        </div>
    );
};
