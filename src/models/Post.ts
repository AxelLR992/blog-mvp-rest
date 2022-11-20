class Post {
  postId: number;
  headerFileId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: RowData) {
    if (data) {
      this.postId = data.POST_ID;
      this.headerFileId = data.HEADER_FILE_ID;
      this.title = data.TITLE;
      this.content = data.CONTENT;
      this.createdAt = new Date(data.CREATED_AT);
      this.updatedAt = new Date(data.UPDATED_AT);
    }
  }
}

export default Post;

interface RowData {
  POST_ID: number;
  HEADER_FILE_ID: number;
  TITLE: string;
  CONTENT: string;
  CREATED_AT: Date;
  UPDATED_AT: Date;
}
