"use strict";

const fs = require("node:fs");

exports.updateMain = (api, callback) => {
    const tsPath = api.resolve("./src/main.ts");
    const jsPath = api.resolve("./src/main.js");

    const mainPath = fs.existsSync(tsPath) ? tsPath : jsPath;
    const encoding = "utf-8";

    const mainContentSrc = fs.readFileSync(mainPath, { encoding });
    const mainContentSrcLines = mainContentSrc.split(/\r?\n/g);

    const mainContentDst = callback(mainContentSrcLines).join("\n");
    fs.writeFileSync(mainPath, mainContentDst, { encoding });
};
