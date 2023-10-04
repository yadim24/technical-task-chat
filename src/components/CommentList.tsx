import {InfiniteData, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Fragment, useContext} from "react";
import getAuthorsRequest from "src/api/authors/getAuthorsRequest";
import getCommentsRequest from "src/api/comments/getCommentsRequest";
import {LikeStateContext} from "src/context/LikeStateContext";
import {invariant} from "src/lib/invariant";
import {pluralize} from "src/lib/pluralize";
import {Comment} from "./Comment";
import styles from "./CommentList.module.css";

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

function transformData(data: InfiniteData<TCommentsDto>) {
  const sortComments = (
    comments: TComment[],
    parentId: number | null,
  ): TComment[] =>
    comments
      .filter((item) => item.parent === parentId)
      .flatMap((item) => {
        const children = sortComments(comments, item.id);
        return [item, ...children];
      });

  return {
    pageParams: data.pageParams,
    pages: data.pages.map((page) => ({
      ...page,
      data: sortComments(page.data, null),
    })),
  };
}

export const CommentList = () => {
  const context = useContext(LikeStateContext);
  invariant(context != null, "Не подключен провайдер!");
  const [likeComment] = context;

  const queryAuthors = useQuery<TAuthor[], unknown, TAuthor[], string[]>({
    queryKey: ["authors"],
    queryFn: () => getAuthorsRequest(),
  });

  const queryComments = useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: ({pageParam = 1}) =>
      getCommentsRequest(pageParam) as Promise<TCommentsDto>,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.total_pages)
        return lastPage.pagination.page + 1;
    },
    select: transformData,
  });

  if (!queryComments.data) return null;

  if (!queryAuthors.data) return null;

  const totalComments = queryComments.data.pages.reduce(
    (sum, page) => sum + page.pagination.size,
    0,
  );

  const totalCommentsPluralized = pluralize(totalComments, [
    "комментарий",
    "комментария",
    "комментариев",
  ]);

  const authors: TAuthors = queryAuthors.data.reduce((newAuthors, author) => {
    return {...newAuthors, [author.id]: author};
  }, {});

  const totalLikesCount = queryComments.data.pages.reduce(
    (sumTotal, page) =>
      sumTotal +
      page.data.reduce((sumPage, comment) => {
        if (comment.parent) return sumPage;
        return sumPage + comment.likes;
      }, 0),
    0,
  );

  return (
    <div className={styles["comments-container"]}>
      <div className={styles.header}>
        <div className={styles["total-comments"]}>
          {totalComments} {totalCommentsPluralized}
        </div>
        <div className={styles["total-likes-wrapper"]}>
          <img className={styles.heart} src="heart.svg" alt="heart" />
          <div className={styles["total-likes"]}>
            {totalLikesCount + likeComment.length}
          </div>
        </div>
      </div>
      <hr className={styles.line} />
      <div className={styles["comments-list"]}>
        {queryComments.data.pages.map((page) => (
          <Fragment key={page.pagination.page}>
            {page.data.map((comment) => (
              <Comment
                key={comment.id}
                date={comment.created}
                likes={comment.likes}
                text={comment.text}
                author={authors[comment.author].name}
                avatar={authors[comment.author].avatar}
                isChild={comment.parent !== null}
                commentId={comment.id}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {queryComments.hasNextPage && (
        <button
          className={styles["next-page"]}
          onClick={() => queryComments.fetchNextPage()}
          disabled={queryComments.isFetchingNextPage}
        >
          Загрузить еще
        </button>
      )}
    </div>
  );
};
