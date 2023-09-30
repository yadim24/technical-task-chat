import {Comment} from "./Comment";
import styles from "./CommentsList.module.css";

export const CommentsList = ({data}) => {
    return (
        <div className={styles["comments-list"]}>
            {data.map((comment) => (
                <Comment data={data} />
            ))}
        </div>
    );
};
