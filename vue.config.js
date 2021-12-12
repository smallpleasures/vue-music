module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",

      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
  lintOnSave: false,
};
