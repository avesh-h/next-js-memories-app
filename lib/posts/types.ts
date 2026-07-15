/**
 * Post domain types. Plain types (no server imports) so they're usable from
 * both Server Components and Client Components. Shapes mirror the PostService
 * Mongoose model (`postModel.js`).
 */

export interface PostComment {
  userId: string;
  comment: string;
}

export interface Post {
  _id: string;
  title: string;
  message: string;
  /** Display name of the creator, denormalized onto the post by the backend. */
  name: string;
  /** User id of the creator. */
  creator: string;
  tags: string[];
  /** Base64 data URL of the image (backend stores the raw string). */
  selectedFile: string;
  /** Array of user ids who liked the post. */
  likes: string[];
  comments: PostComment[];
  createdAt: string;
}

/** Shape returned by `GET /v1/posts` — a page of the feed. */
export interface PostsPage {
  data: Post[];
  currentPage: number | string;
  numberOfPages: number;
}

/** State returned by the commentPost Server Action, consumed by `useActionState`. */
export interface CommentFormState {
  status?: "success" | "error";
  error?: string;
}

/** State returned by the createPost Server Action, consumed by `useActionState`. */
export interface PostFormState {
  errors?: {
    title?: string[];
    message?: string[];
    tags?: string[];
    selectedFile?: string[];
  };
  message?: string;
  status?: "success" | "error";
  values?: {
    title?: string;
    message?: string;
    tags?: string;
  };
}
