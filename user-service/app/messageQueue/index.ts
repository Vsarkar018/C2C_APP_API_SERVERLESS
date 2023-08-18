import axios from "axios";

const PRODUCT_SERVICE_URL =
  "https://038bfl4o60.execute-api.ap-south-1.amazonaws.com/prod/products-queue";

const PRODUCT_SERVICE_URL_LOCALHOST = "http://localhost:3000/products-queue";

export const PullData = async (requestData: Record<string, unknown>) => {
  return axios.post(PRODUCT_SERVICE_URL_LOCALHOST, requestData);
};
