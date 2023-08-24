import axios from "axios";

export const PullData = async (requestData: Record<string, unknown>) => {
  return axios.post(process.env.PRODUCT_SERVICE_URL, requestData);
};
