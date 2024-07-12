export const ok = (message: string, data: any) => ({
  status: "000",
  message: message || "Success",
  data,
});

export const badRequest = (message: string, errors: any) => ({
  status: "400",
  message: message || "Bad Request",
  errors,
});
