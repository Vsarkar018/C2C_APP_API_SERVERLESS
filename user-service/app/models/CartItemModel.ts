export interface CartItemModel {
  productId: string;
  name: string;
  image_url: string;
  price: number;
  item_qty: number;
  item?: number;
  cart_id?: number;
}
