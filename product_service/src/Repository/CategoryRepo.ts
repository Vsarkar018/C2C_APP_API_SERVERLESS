import { categories, CategoryDoc } from "../Models/CategoryModel";
import { CategoryInput } from "../Models/dto/CategoryInput";

export class CategoryRepository {
  constructor() {}
  async createCategory({ name, parentId }: CategoryInput) {
    const newCategory = await categories.create({
      name,
      parentId,
      displayOrder: [],
      products: [],
    });
    if (parentId) {
      const parentCategory = (await categories.findById(
        parentId
      )) as CategoryDoc;
      parentCategory.SubCategories = [
        ...parentCategory.SubCategories,
        newCategory,
      ];
      await parentCategory.save();
    }
    return newCategory;
  }
  async getCategory(id: string, offset = 0, perPage?: number) {
    return categories
      .findById(id, {
        products: { $slice: [offset, perPage ? perPage : 100] },
      })
      .populate({
        path: "products",
        model: "products",
      });
  }
  async getAllCategories(offest = 0, perPage?: number) {
    return categories
      .find({ parentId: null })
      .populate({
        path: "subCategories",
        model: "categories",
        populate: {
          path: "subCategories",
          model: "categories",
        },
      })
      .skip(offest)
      .limit(perPage ? perPage : 100);
  }
  async editCategory({ id, name, displayOrder }: CategoryInput) {
    let category = (await categories.findById(id)) as CategoryDoc;
    category.name = name;
    category.displayOrder = displayOrder;
    return category.save();
  }
  async deleteCategory(id: string) {
    return categories.deleteOne({ _id: id });
  }
}
