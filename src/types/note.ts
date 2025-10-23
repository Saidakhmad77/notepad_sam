export type Note = {
  id: string;
  title: string;
  body: string;     // rename to `content` if your backend expects that
  isNotice?: boolean;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
};
