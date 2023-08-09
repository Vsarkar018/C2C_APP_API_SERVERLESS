import { products } from "../Models/ProductModel";
import { ProductInput } from "../Models/dto/ProductInput";

export class ProductRepository {
  constructor() {}

  async createProduct({
    name,
    description,
    price,
    imageUrl,
    categoryId,
  }: ProductInput) {
    return products.create({
      name,
      description,
      price,
      imageUrl,
      categoryId,
      availability: true,
    });
  }
  async geAllProducts(offset = 0, pages?: number) {}
  async getProduct(id: string) {}
  async updateProduct({
    name,
    description,
    price,
    imageUrl,
    categoryId,
  }: ProductInput) {}
  async deleteProduct(id: string) {}
}
