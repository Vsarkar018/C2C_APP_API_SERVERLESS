import { Length } from "class-validator";

export class AdressInput {
  id: number;
  @Length(3, 32)
  address_line1: string;
  address_line2: string;

  @Length(3, 32)
  city: string;

  @Length(4, 6)
  postCode: string;

  @Length(4, 6)
  country: string;
}

export class ProfileInput {
  @Length(3, 32)
  first_name: string;

  @Length(3, 32)
  last_name: string;

  @Length(5, 6)
  user_type: string;

  address: AdressInput;
}
