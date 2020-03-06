// @ts-ignore
import path from "path";

// build configuration
export = {
  webpack: {
    output: {
      path: path.resolve(__dirname, "./dist"),
      publicPath: "/op/assets/",
    },
  },
};
