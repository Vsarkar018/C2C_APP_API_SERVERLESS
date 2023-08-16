import { Length } from "class-validator";

export class ServiceInput {
  action: string;
  @Length(2, 24)
  productId: string;
}
