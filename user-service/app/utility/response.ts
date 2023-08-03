import { StatusCodes } from "http-status-codes";
const ResponseEntity = (statusCode: number, message: string, data: unknown) => {
  if (data) {
    return {
      statusCode: StatusCodes.OK,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: message,
        data: data,
      }),
    };
  } else {
    return {
      statusCode: StatusCodes.OK,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: message,
      }),
    };
  }
};

export const SuccessResponse = (data: object) => {
  return ResponseEntity(StatusCodes.OK, "Success", data);
};

export const ErrorResponse = (code = 1000, error: unknown) => {
  if (Array.isArray(error)) {
    const errorObject = error[0].constraints;
    const errorMessage =
      errorObject[Object.keys(errorObject)[0]] || "Error Occurred";
    return ResponseEntity(code, errorMessage, errorMessage);
  }
  return ResponseEntity(code, `${error}`, error);
};
