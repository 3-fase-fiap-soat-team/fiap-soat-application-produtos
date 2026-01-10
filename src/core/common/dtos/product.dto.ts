export class ProductDTO {
    id: string;
    name: string;
    description:string;
    price: number;
    stock: number;
    image: string;
    categoryId?: string;
    categoryName?: string;
}
