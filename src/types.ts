export type IBlogPost = {
  slug: string;
  category?: {
    name: string;
    slug: string;
  };
  title: string;
  excerpt?: string;
  content: string;
  featuredImage: string;
  author: string;
  publishedAt?: Date;
};

export type IBlogCategory = {
  name: string;
  slug: string;
}

export type ICustomData = {
  key: string;
  value: string;
}

export type ILead = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website: string;
  source?: string;
  notes?: string;
  customData?: ICustomData[];
  websiteId: string;
}

export type CMSResponse<T> = {
  data: T;
  meta?: {
    [key: string]: any;
  };
} 