#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const jose = require("jose");

const keystore = new jose.JWKS.KeyStore();

Promise.all([
  keystore.generate("RSA", 2048, { use: "sig" }),
  keystore.generate("RSA", 2048, { use: "enc" }),
  keystore.generate("EC", "P-256", { use: "sig" }),
  keystore.generate("EC", "P-256", { use: "enc" }),
  keystore.generate("OKP", "Ed25519", { use: "sig" }),
]).then(() => {
  const filePath = path.resolve("./jwks.json");
  try {
    fs.statSync(filePath);
  } catch {
    fs.writeFileSync(filePath, JSON.stringify(keystore.toJWKS(true), null, 2));
    console.log(`Succeed: ${filePath} created`);
    process.exit(0);
  }
  console.error(`Error: ${filePath} already exists`);
  process.exit(1);
});
