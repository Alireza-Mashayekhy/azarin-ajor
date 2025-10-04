export interface CategoryTranslation {
    id: number;
    locale: string;
    title: string;
    categoryId: number;
}

export interface Category {
    id: number;
    slug: string;
    translations: CategoryTranslation[];
    _count: {
        posts: number;
    };
}

export interface CreateCategoryData {
    slug: string;
    translations: Array<{
        locale: string;
        title: string;
    }>;
}

export interface CategoryFormData {
    slug: string;
    faTitle: string;
    enTitle: string;
}
