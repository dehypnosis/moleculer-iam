#!/usr/bin/env node

// const fs = require("fs");
// const path = require("path");
const jose = require("jose");

const keystore = new jose.JWKS.KeyStore();
const handleGenerationError = error => console.warn(`Warning:`, error.message);

Promise.all([
  keystore.generate("RSA", 2048, {use: "sig"}).catch(handleGenerationError),
  keystore.generate("RSA", 2048, {use: "enc"}).catch(handleGenerationError),
  keystore.generate("EC", "P-256", {use: "sig"}).catch(handleGenerationError),
  keystore.generate("EC", "P-256", {use: "enc"}).catch(handleGenerationError),
  keystore.generate("OKP", "Ed25519", {use: "sig"}).catch(handleGenerationError),
])
  .then(() => {
    if (keystore.all({ use: "sig" }).length === 0) {
      console.error(`Error: empty signature keys`);
      process.exit(1);
    } else if (keystore.all({ use: "enc" }).length === 0) {
      console.error(`Error: empty encryption keys`);
      process.exit(1);
    }

    const jwks = JSON.stringify(keystore.toJWKS(true), null, 2);
    console.log(jwks);
    // const filePath = path.resolve(process.cwd(), "./jwks.json");
    // try {
    //   fs.statSync(filePath);
    // } catch (error) {
    //   fs.writeFileSync(filePath, jwks);
    //   console.log(`Succeed: ${filePath} created`);
    //   process.exit(0);
    // }
    // console.error(`Error: ${filePath} already exists`);
    // process.exit(1);
  });
