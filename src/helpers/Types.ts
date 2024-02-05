export type user = {
  user_id: number;
  email: string;
  user_name: string;
  token: string;
};

export type toastType = {
  show: boolean;
  background: string;
  message: string;
};

export type singleBlogPostType = {
  blog_id: number;
  blog_title: string;
  blog_description: string;
  blog_content: string;
  blog_image: string | null;
  published_date: string | undefined;
  user_id: number;
  author: string;
};
