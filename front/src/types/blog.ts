export interface BlogTranslation {
    id: number;
    locale: string;
    title: string;
    content: string;
    excerpt?: string | null;
    blogPostId: number;
}

export interface BlogCategory {
    id: number;
    slug: string;
    translations: Array<{
        id: number;
        locale: string;
        title: string;
        categoryId: number;
    }>;
}

export interface Blog {
    id: number;
    slug: string;
    categoryId: number;
    publishedAt: string | null;
    translations: BlogTranslation[];
    category: BlogCategory;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogData {
    slug: string;
    categoryId: number;
    publishedAt?: string | null;
    translations: Array<{
        locale: string;
        title: string;
        content: string;
        excerpt?: string | null;
    }>;
}

export interface BlogFormData {
    slug: string;
    categoryId: number;
    publishedAt: string;
    faTitle: string;
    faContent: string;
    faExcerpt: string;
    enTitle: string;
    enContent: string;
    enExcerpt: string;
}
