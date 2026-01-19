
export interface Blog {
  _id: string;
  blogTitle: string;
  blogDescription: string;
  blogImage: string;
  tags?: string[];
  createdAt: string;
  slug: string;
}
