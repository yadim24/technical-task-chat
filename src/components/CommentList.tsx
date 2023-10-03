import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {Fragment} from "react";
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

type TFirstAnswers = TComment & {answers: TComment[] | null};

type TCommentList = {
  [key: number]: TFirstAnswers;
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

const transformData = (data: TCommentsDto) => {
  const commentsData = data.data.filter((comment) => !comment.parent);

  const answersData = data.data.filter((comment) => comment.parent);
  // .sort((a, b) => a.id - b.id);

  let commentListWithAnswers: TFirstAnswers[] = [];

  commentsData.forEach((comment) => {
    commentListWithAnswers.push({
      ...comment,
      answers: answersData.filter((answer) => answer.parent === comment.id),
    });
  });

  let commentList: TCommentList = commentListWithAnswers.reduce(
    (commentListObj, comment) => {
      return {...commentListObj, [comment.id]: comment};
    },
    {},
  );

  answersData.forEach((answer) => {
    for (let key in commentList) {
      const commentWithAnswers = commentList[key].answers?.find(
        (anyAnswer) => anyAnswer.id === answer.parent,
      );

      if (commentWithAnswers) commentList[key].answers?.push(answer);
    }
  });

  let newCommentList = [];

  for (let key in commentList) {
    newCommentList.push(commentList[key]);
  }

  const newData = {
    pagination: data.pagination,
    data: newCommentList,
  };

  return newData;
};

export const CommentList = () => {
  const queryAuthors = useQuery<TAuthor[], unknown, TAuthor[], string[]>({
    queryKey: ["authors"],
    queryFn: () => getAuthorsRequest(),
  });

  const queryComments = useInfiniteQuery<
    TCommentsDto,
    unknown,
    TCommentsDto,
    string[]
  >({
    queryKey: ["comments"],
    queryFn: ({pageParam = 1}) => getCommentsRequest(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.total_pages)
        return lastPage.pagination.page + 1;
    },
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

  console.log(transformData(queryComments.data.pages[0]));

  return (
    <div className={styles["comments-container"]}>
      <div className={styles.header}>
        <div className={styles["total-comments"]}>
          {totalComments} {totalCommentsPluralized}
        </div>
        <Likes
          likes={queryComments.data.pages.reduce(
            (sumTotal, page) =>
              sumTotal +
              page.data.reduce((sumPage, comment) => {
                if (comment.parent) return sumPage;
                return sumPage + comment.likes;
              }, 0),
            0,
          )}
        />
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
