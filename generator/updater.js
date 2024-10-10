"use strict";

const fs = require("node:fs");
const https = require("node:https");

exports.queryPackage = (pkgName) => new Promise((resolve) => {
    https.request(`https://registry.npmjs.org/${pkgName}`, (res) => {
        res.setEncoding("utf8");

        let chunks = "";
        res.on("data", (chunk) => {
            chunks += chunk;
        });
        res.on("end", () => {
            const data = JSON.parse(chunks);
            resolve(data);
        });
    }).end();
});

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
