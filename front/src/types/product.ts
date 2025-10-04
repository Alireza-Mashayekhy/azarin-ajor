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
