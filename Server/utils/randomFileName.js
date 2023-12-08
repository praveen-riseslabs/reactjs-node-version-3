import crypto from "crypto";

export const randomFileName = (bytes = 16) =>
  crypto.randomBytes(bytes).toString("hex");
