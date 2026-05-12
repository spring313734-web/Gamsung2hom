// 파일 경로: src/pages/RegionEventPostDetailPage.jsx
// ========================================
// 📌 감성여행2 지역별 후기 / 참여글 상세 페이지
// - URL slug + postId 기준 지역 후기 상세 데이터 조회
// - regionEvents 공용 데이터 구조에서 글/댓글 데이터를 읽음
// - AuthContext의 현재 로그인 사용자 기준으로 UI 분기
// - 글 작성자만 글 삭제 버튼 표시
// - 댓글 작성자만 댓글 수정 / 삭제 버튼 표시
// - 비로그인 상태에서는 댓글 입력창 대신 안내 문구 표시
// - 다음 단계에서 서버 저장 구조로 확장 가능한 상태 유지
// ========================================

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { getRegionBySlug } from "../data/regionEvents";
import { useAuth } from "../contect/AuthContext";
import "./RegionEventPostDetailPage.css";

const DEFAULT_REGION_IMAGE =
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSafeText(value, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function toSafeCount(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatDateText(value, fallback = "등록일 준비중") {
  const safeValue = toSafeText(value, "");

  if (!safeValue) {
    return fallback;
  }

  const date = new Date(safeValue);

  if (Number.isNaN(date.getTime())) {
    return safeValue;
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDisplayName(item, fallback = "참여자") {
  const nickname = toSafeText(item?.nickname, "");
  const userId = toSafeText(item?.userId, "");
  const authorDisplayName = toSafeText(item?.authorDisplayName, "");

  if (nickname && userId && nickname !== userId) {
    return `${nickname} (${userId})`;
  }

  return nickname || authorDisplayName || userId || fallback;
}

function getPostTypeLabel(type) {
  const safeType = toSafeText(type, "").toLowerCase();

  if (safeType === "review") return "후기";
  if (safeType === "participation") return "참여글";
  if (safeType === "post") return "참여글";
  return "후기 / 참여글";
}

function findPostById(region, postId) {
  const postItems = normalizeArray(
    region?.postItems ?? region?.posts ?? region?.userPosts
  );

  return postItems.find((item) => item?.id === postId);
}

function buildPostDetail(region, postId) {
  const post = findPostById(region, postId);

  if (!post) return null;

  const commentItems = normalizeArray(post?.commentItems ?? post?.comments);
  const relatedEvents = [
    ...normalizeArray(region?.events),
    ...normalizeArray(region?.festivalEvents),
    ...normalizeArray(region?.tourEvents),
  ];

  const relatedEvent = relatedEvents.find((event) => event?.id === post?.eventId);

  return {
    id: post?.id ?? "",
    eventId: post?.eventId ?? "",
    userId: toSafeText(post?.userId, ""),
    nickname: toSafeText(post?.nickname, ""),
    authorDisplayName: toSafeText(post?.authorDisplayName, ""),
    title: toSafeText(post?.title, "후기 상세"),
    summary: toSafeText(post?.summary, ""),
    content: toSafeText(
      post?.content ?? post?.summary,
      "후기 본문이 아직 준비되지 않았습니다."
    ),
    postTypeLabel: getPostTypeLabel(post?.type),
    authorName: getDisplayName(post, "참여자"),
    createdAt: toSafeText(post?.createdAt, "등록일 준비중"),
    updatedAt: toSafeText(post?.updatedAt, ""),
    isEdited: Boolean(post?.isEdited),
    likeCount: toSafeCount(post?.likeCount),
    commentCount:
      commentItems.length > 0 ? commentItems.length : toSafeCount(post?.commentCount),
    image: toSafeText(post?.image, ""),
    eventTitle: toSafeText(relatedEvent?.title ?? post?.eventTitle, ""),
    comments: commentItems.map((comment, index) => ({
      id: comment?.id ?? `comment-${index}`,
      authorName: getDisplayName(comment, "참여자"),
      nickname: toSafeText(comment?.nickname, ""),
      userId: toSafeText(comment?.userId, ""),
      authorDisplayName: toSafeText(comment?.authorDisplayName, ""),
      content: toSafeText(comment?.content, "댓글 내용이 없습니다."),
      createdAt: toSafeText(comment?.createdAt, "등록일 준비중"),
      updatedAt: toSafeText(comment?.updatedAt ?? comment?.createdAt, ""),
      isEdited: Boolean(comment?.isEdited),
    })),
  };
}

function CommentItem({
  comment,
  isEditing,
  editingValue,
  canManage,
  onStartEdit,
  onDeleteComment,
  onChangeEditValue,
  onCancelEdit,
  onSaveEdit,
}) {
  return (
    <article className="region-post-detail-comment-card">
      <div className="region-post-detail-comment-head">
        <div>
          <p className="region-post-detail-comment-author">
            {comment?.authorName ?? "참여자"}
          </p>
          <p className="region-post-detail-comment-date">
            {formatDateText(comment?.createdAt)}
            {comment?.isEdited ? " · 수정됨" : ""}
          </p>
        </div>

        {canManage ? (
          <div className="region-post-detail-comment-action-buttons">
            <button
              type="button"
              className="region-post-detail-comment-edit-button"
              onClick={onStartEdit}
            >
              댓글 수정
            </button>

            <button
              type="button"
              className="region-post-detail-comment-delete-button"
              onClick={onDeleteComment}
            >
              댓글 삭제
            </button>
          </div>
        ) : null}
      </div>

      {isEditing ? (
        <div className="region-post-detail-comment-edit-box">
          <textarea
            className="region-post-detail-comment-textarea"
            value={editingValue}
            onChange={(event) => onChangeEditValue(event.target.value)}
          />

          <div className="region-post-detail-comment-edit-actions">
            <button
              type="button"
              className="region-post-detail-save-button"
              onClick={onSaveEdit}
            >
              저장
            </button>
            <button
              type="button"
              className="region-post-detail-cancel-button"
              onClick={onCancelEdit}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="region-post-detail-comment-content">
          {comment?.content ?? "댓글 내용이 없습니다."}
        </p>
      )}
    </article>
  );
}

export default function RegionEventPostDetailPage() {
  const { slug, postId } = useParams();
  const navigate = useNavigate();
  const region = getRegionBySlug(slug);
  const { currentUser, isLoggedIn } = useAuth();

  const initialPost = useMemo(() => {
    if (!region) return null;
    return buildPostDetail(region, postId);
  }, [region, postId]);

  const [postDetail, setPostDetail] = useState(initialPost);
  const [editingCommentId, setEditingCommentId] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [newCommentValue, setNewCommentValue] = useState("");

  const currentUserId = toSafeText(currentUser?.id, "");
  const currentUserDisplayName = getDisplayName(
    {
      nickname: currentUser?.nickname,
      userId: currentUser?.id,
    },
    "로그인 사용자"
  );

  const isMyPost = Boolean(
    postDetail?.userId && currentUserId && postDetail.userId === currentUserId
  );

  function handleGoBack() {
    navigate(`/events/region/${slug}/posts`);
  }

  function handleGoRegionDetail() {
    navigate(`/events/region/${slug}`);
  }

  function handleStartEdit(comment) {
    if (!comment) return;
    if (comment?.userId !== currentUserId) return;

    setEditingCommentId(comment?.id ?? "");
    setEditingValue(comment?.content ?? "");
  }

  function handleCancelEdit() {
    setEditingCommentId("");
    setEditingValue("");
  }

  function handleSaveEdit(commentId) {
    const trimmedValue = editingValue.trim();

    if (!trimmedValue) {
      window.alert("댓글 내용을 입력해주세요.");
      return;
    }

    setPostDetail((prev) => {
      if (!prev) return prev;

      const targetComment = prev.comments.find((comment) => comment.id === commentId);

      if (!targetComment || targetComment.userId !== currentUserId) {
        return prev;
      }

      const nextComments = prev.comments.map((comment) => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          content: trimmedValue,
          updatedAt: new Date().toISOString(),
          isEdited: true,
        };
      });

      return {
        ...prev,
        comments: nextComments,
        commentCount: nextComments.length,
      };
    });

    setEditingCommentId("");
    setEditingValue("");
  }

  function handleDeleteComment(commentId) {
    const shouldDelete = window.confirm("이 댓글을 삭제할까요?");

    if (!shouldDelete) {
      return;
    }

    setPostDetail((prev) => {
      if (!prev) return prev;

      const targetComment = prev.comments.find((comment) => comment.id === commentId);

      if (!targetComment || targetComment.userId !== currentUserId) {
        return prev;
      }

      const nextComments = prev.comments.filter(
        (comment) => comment.id !== commentId
      );

      return {
        ...prev,
        comments: nextComments,
        commentCount: nextComments.length,
      };
    });

    if (editingCommentId === commentId) {
      setEditingCommentId("");
      setEditingValue("");
    }
  }

  function handleAddComment() {
    if (!isLoggedIn) {
      window.alert("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }

    const trimmedValue = newCommentValue.trim();

    if (!trimmedValue) {
      window.alert("새 댓글 내용을 입력해주세요.");
      return;
    }

    setPostDetail((prev) => {
      if (!prev) return prev;

      const now = new Date().toISOString();

      const nextComment = {
        id: `new-comment-${Date.now()}`,
        authorName: currentUserDisplayName,
        nickname: toSafeText(currentUser?.nickname, ""),
        userId: currentUserId,
        authorDisplayName: currentUserDisplayName,
        content: trimmedValue,
        createdAt: now,
        updatedAt: now,
        isEdited: false,
      };

      const nextComments = [...prev.comments, nextComment];

      return {
        ...prev,
        comments: nextComments,
        commentCount: nextComments.length,
      };
    });

    setNewCommentValue("");
  }

  function handleDeletePost() {
    if (!isMyPost) return;

    const shouldDelete = window.confirm("이 글을 삭제할까요?");

    if (!shouldDelete) {
      return;
    }

    window.alert("현재 단계에서는 상세 화면에서만 삭제 흐름을 확인합니다.");
    navigate(`/events/region/${slug}/posts`);
  }

  if (!region || !postDetail) {
    return (
      <div className="region-post-detail-page">
        <div className="region-post-detail-empty">
          <p className="region-post-detail-empty-badge">POST DETAIL</p>
          <h1>후기 상세 정보를 찾을 수 없습니다.</h1>
          <p>
            지역 후기 데이터가 아직 연결되지 않았거나 잘못된 경로로 접근했습니다.
          </p>

          <div className="region-post-detail-empty-actions">
            <button
              type="button"
              className="region-post-detail-primary-button"
              onClick={() => navigate("/events")}
            >
              이벤트 메인으로 이동
            </button>
            <button
              type="button"
              className="region-post-detail-secondary-button"
              onClick={() => navigate(-1)}
            >
              이전 화면으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        badge={`${region?.name ?? "지역"} 후기 / 참여글`}
        title={postDetail.title}
        description={
          postDetail.summary ||
          `${region?.name ?? "지역"} 후기 상세 페이지입니다.`
        }
        backgroundImage={
          postDetail.image || region?.heroImage || DEFAULT_REGION_IMAGE
        }
      />

      <div className="region-post-detail-page">
        <section className="region-post-detail-shell">
          <div className="region-post-detail-header">
            <div>
              <p className="region-post-detail-label">POST DETAIL</p>
              <h2>{postDetail.title}</h2>
              <p className="region-post-detail-description">
                {postDetail.summary || "후기 / 참여글 상세 내용을 확인할 수 있습니다."}
              </p>
            </div>

            <div className="region-post-detail-header-actions">
              <button
                type="button"
                className="region-post-detail-secondary-button"
                onClick={handleGoBack}
              >
                목록으로 돌아가기
              </button>

              <button
                type="button"
                className="region-post-detail-secondary-button"
                onClick={handleGoRegionDetail}
              >
                지역 상세로 이동
              </button>

              {isMyPost ? (
                <button
                  type="button"
                  className="region-post-detail-comment-delete-button"
                  onClick={handleDeletePost}
                >
                  글 삭제
                </button>
              ) : null}
            </div>
          </div>

          <article className="region-post-detail-main-card">
            <div className="region-post-detail-top">
              <div className="region-post-detail-top-left">
                <span className="region-post-detail-chip">
                  {postDetail.postTypeLabel}
                </span>

                {postDetail.eventTitle ? (
                  <span className="region-post-detail-event-chip">
                    {postDetail.eventTitle}
                  </span>
                ) : null}
              </div>

              <span className="region-post-detail-author">
                {postDetail.authorName}
              </span>
            </div>

            {postDetail.image ? (
              <div className="region-post-detail-image-wrap">
                <img
                  src={postDetail.image}
                  alt={postDetail.title}
                  className="region-post-detail-image"
                />
              </div>
            ) : null}

            <div className="region-post-detail-content-box">
              <p>{postDetail.content}</p>
            </div>

            <div className="region-post-detail-social">
              <span className="region-post-detail-social-item">
                좋아요 {postDetail.likeCount}
              </span>
              <span className="region-post-detail-social-item">
                댓글 {postDetail.commentCount}
              </span>
              {postDetail.isEdited ? (
                <span className="region-post-detail-social-item">수정됨</span>
              ) : null}
              {isMyPost ? (
                <span className="region-post-detail-social-item">내 글</span>
              ) : null}
            </div>

            <div className="region-post-detail-meta">
              <span>등록일: {formatDateText(postDetail.createdAt)}</span>
              {postDetail.updatedAt ? (
                <span>최종수정: {formatDateText(postDetail.updatedAt)}</span>
              ) : null}
            </div>
          </article>

          <section className="region-post-detail-comments-section">
            <div className="region-post-detail-comments-head">
              <h3>댓글 {postDetail.comments.length}개</h3>
              <p>내 댓글만 수정 / 삭제할 수 있도록 분리한 상태입니다.</p>
            </div>

            {isLoggedIn ? (
              <div className="region-post-detail-comment-write-box">
                <p className="region-post-detail-login-state">
                  현재 로그인 사용자: {currentUserDisplayName}
                </p>

                <textarea
                  className="region-post-detail-comment-textarea"
                  placeholder="새 댓글을 입력해주세요."
                  value={newCommentValue}
                  onChange={(event) => setNewCommentValue(event.target.value)}
                />

                <div className="region-post-detail-comment-write-actions">
                  <button
                    type="button"
                    className="region-post-detail-save-button"
                    onClick={handleAddComment}
                  >
                    댓글 등록
                  </button>
                </div>
              </div>
            ) : (
              <div className="region-post-detail-comment-login-box">
                로그인 후 댓글을 작성할 수 있습니다.
              </div>
            )}

            {postDetail.comments.length > 0 ? (
              <div className="region-post-detail-comments-list">
                {postDetail.comments.map((comment) => {
                  const canManageComment =
                    Boolean(currentUserId) && comment?.userId === currentUserId;

                  return (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      isEditing={editingCommentId === comment.id}
                      editingValue={
                        editingCommentId === comment.id ? editingValue : ""
                      }
                      canManage={canManageComment}
                      onStartEdit={() => handleStartEdit(comment)}
                      onDeleteComment={() => handleDeleteComment(comment.id)}
                      onChangeEditValue={setEditingValue}
                      onCancelEdit={handleCancelEdit}
                      onSaveEdit={() => handleSaveEdit(comment.id)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="region-post-detail-empty-comments">
                아직 등록된 댓글이 없습니다.
              </div>
            )}
          </section>
        </section>
      </div>
    </>
  );
}