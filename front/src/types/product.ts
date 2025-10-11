export type Product_type = {
    id: string;
    slug: string;
    price: number;
    image: string;
    title: string;
    size: string;
    translations: {
        locale: string;
        title: string;
        description: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
};

export type Product = {
    id: number;
    slug: string;
    price: number;
    imageUrl?: string;
    size?: string;
    widthMm?: number;
    heightMm?: number;
    thicknessMm?: number;
    unitsPerBox?: number;
    areaPerUnit?: number;
    translations: {
        id: number;
        locale: string;
        title: string;
        description: string;
    }[];
    createdAt: string;
    updatedAt: string;
};
