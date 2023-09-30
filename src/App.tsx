import styles from "./App.module.css";
import {CommentsList} from "./components/CommentsList";

function App() {
    return (
        <>
            <div className={styles.header}>
                <div className={styles["total-comments"]}>267 комментариев</div>
                <div className={styles["total-likes-wrapper"]}>
                    <img src="heart.svg" alt="like" />
                    <div className={styles["total-likes"]}>8632</div>
                </div>
            </div>
            <CommentsList data={data} />
        </>
    );
}

export default App;
