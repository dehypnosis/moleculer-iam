import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({
  path: path.join(__dirname,'../../../../../','.env')
});
// secrets and envs for apple auth
const APPLE_AUTH_ENV = {
  CLIENT_ID: process.env.CLIENT_ID,
  TEAM_ID: process.env.TEAM_ID,
  KEY_ID: process.env.KEY_ID,
  CALLBACK_URL: process.env.CALLBACK_URL,
  PRIVATE_KEY_STRING: process.env.PRIVATE_KEY_STRING
}  as const;

export default {
  APPLE_AUTH_ENV
};
