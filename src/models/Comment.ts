class PostComment {
  commentId: number;
  postId: number;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: RowData) {
    if (data) {
      this.commentId = data.COMMENT_ID;
      this.postId = data.POST_ID;
      this.author = data.AUTHOR;
      this.content = data.CONTENT;
      this.createdAt = new Date(data.CREATED_AT);
      this.updatedAt = new Date(data.UPDATED_AT);
    }
  }

}

export default PostComment;

interface RowData {
  COMMENT_ID: number;
  POST_ID: number;
  AUTHOR: string;
  CONTENT: string;
  CREATED_AT: Date;
  UPDATED_AT: Date;
}
