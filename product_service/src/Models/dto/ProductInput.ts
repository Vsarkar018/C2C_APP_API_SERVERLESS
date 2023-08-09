import { IsNumber, Length } from "class-validator";

export class ProductInput {
  id: string;

  @Length(3, 120)
  name: string;

  @Length(3, 256)
  description: string;

  categoryId: string;

  imageUrl: string;

  @IsNumber()
  price: number;

  availability: boolean;
}
