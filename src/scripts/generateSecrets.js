import crypto from "crypto";

const accessSecret = crypto.randomBytes(64).toString("hex");
const refreshSecret = crypto.randomBytes(64).toString("hex");

// eslint-disable-next-line no-undef
console.log("ACCESS_TOKEN_SECRET=", accessSecret);
// eslint-disable-next-line no-undef
console.log("REFRESH_TOKEN_SECRET=", refreshSecret);
