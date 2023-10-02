import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import getCommentsRequest from "src/api/comments/getCommentsRequest";
import {pluralize} from "src/lib/pluralize";
import {Comment} from "./Comment";
import styles from "./CommentList.module.css";
import {Likes} from "./Likes";

type TPagination = {
  page: number;
  size: number;
  total_pages: number;
};

type TComment = {
  id: number;
  created: string;
  text: string;
  author: number;
  parent: number | null;
  likes: number;
};

type TCommentsDto = {
  pagination: TPagination;
  data: TComment[];
};

type TAuthor = {
  id: number;
  name: string;
  avatar: string;
};

interface TAuthors {
  [key: string]: {
    name: string;
    avatar: string;
  };
}

export const CommentList = () => {
  const [page, setPage] = useState(1);

  const queryAuthors = useQuery<TAuthor[], unknown, TAuthor[], string[]>({
    queryKey: ["authors"],
    queryFn: () => getAuthorsRequest(),
  });

  const queryComments = useQuery<
    TCommentsDto,
    unknown,
    TCommentsDto,
    (string | {page: number})[]
  >({
    queryKey: ["comments", {page}],
    queryFn: () => getCommentsRequest(page),
  });

  if (!queryComments.data) return null;

  if (!queryAuthors.data) return null;

  const totalComments =
    queryComments.data.pagination.size *
    queryComments.data.pagination.total_pages;

  const totalCommentsPluralized = pluralize(totalComments, [
    "комментарий",
    "комментария",
    "комментариев",
  ]);

  const authors: TAuthors = queryAuthors.data.reduce((newAuthors, author) => {
    return {...newAuthors, [author.id]: author};
  }, {});

  return (
    <div className={styles["comments-container"]}>
      <div className={styles.header}>
        <div className={styles["total-comments"]}>
          {totalComments} {totalCommentsPluralized}
        </div>
        <Likes
          likes={queryComments.data.data.reduce(
            (sum: number, comment) => sum + comment.likes,
            0,
          )}
        />
      </div>
      <hr className={styles.line} />
      <div className={styles["comments-list"]}>
        {queryComments.data.data.map((comment) => (
          <Comment
            date={comment.created}
            likes={comment.likes}
            text={comment.text}
            author={authors[comment.author].name}
            avatar={authors[comment.author].avatar}
          />
        ))}
        h
      </div>
      <button className={styles["next-page"]}>Загрузить еще</button>
    </div>
  );
};
