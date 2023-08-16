import { ProductDoc, products } from "../Models";
import { ProductInput } from "../Models/dto/ProductInput";

export class ProductRepository {
  constructor() {}

  async createProduct({
    name,
    description,
    price,
    imageUrl,
    categoryId,
  }: ProductInput): Promise<ProductDoc> {
    return products.create({
      name,
      description,
      price,
      image_url: imageUrl,
      category_id: categoryId,
      availability: true,
    });
  }
  async geAllProducts(offset = 0, pages?: number) {
    return products
      .find()
      .skip(offset)
      .limit(pages ? pages : 500);
  }
  async getProduct(id: string) {
    return (await products.findById(id)) as ProductDoc;
  }
  async updateProduct({
    id,
    name,
    description,
    price,
    imageUrl,
    categoryId,
    availability,
  }: ProductInput) {
    let existingProduct = (await products.findById(id)) as ProductDoc;
    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.image_url = imageUrl;
    existingProduct.category_id = categoryId;
    existingProduct.availability = availability;
    return existingProduct.save();
  }
  async deleteProduct(id: string) {
    const { category_id } = (await products.findById(id)) as ProductDoc;
    const delteResult = await products.deleteOne({ _id: id });
    return { category_id, delteResult };
  }
}
