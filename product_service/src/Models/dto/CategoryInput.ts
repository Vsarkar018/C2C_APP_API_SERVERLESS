import { Length } from "class-validator";

export class CategoryInput {
  id: string;

  @Length(1, 128)
  name: string;

  parentId?: string;

  products: string[];

  displayOrder: number;

  imageUrl: string;
}

export class AddItemInput {
  @Length(3, 128)
  id: string;

  products: string[];
}
