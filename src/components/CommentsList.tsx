import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import getCommentsRequest from "src/api/comments/getCommentsRequest";
import {pluralize} from "src/lib/pluralize";
import styles from "./CommentsList.module.css";
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

export const CommentsList = () => {
  const [page, setPage] = useState(1);

  const queryAuthors = useQuery({
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

  const totalComments =
    queryComments.data.pagination.size *
    queryComments.data.pagination.total_pages;

  const totalCommentsPluralized = pluralize(totalComments, [
    "комментарий",
    "комментария",
    "комментариев",
  ]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles["total-comments"]}>
          {totalComments} {totalCommentsPluralized}
        </div>
        <Likes
          totalLikes={queryComments.data.data.reduce(
            (sum: number, comment) => sum + comment.likes,
            0,
          )}
        />
      </div>
      {/* <div className={styles["comments-list"]}>
        {queryComments.data.data.map((comment) => (
          <Comment data={} />
        ))}
      </div> */}
    </>
  );
};
