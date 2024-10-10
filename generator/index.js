"use strict";

const {
    queryPackage,
    updateMain,
} = require("./updater");

module.exports = async (api, options) => {
    // Install latest Axios
    const axiosPkg = await queryPackage("axios");
    const {
        latest: axiosPkgVersion,
    } = axiosPkg["dist-tags"];
    api.extendPackage({
        devDependencies: {
            axios: `^${axiosPkgVersion}`,
        },
    });

    // Inject config files
    api.render({
        "./src/plugins/axios.js": "./templates/plugins/axios.js",
    }, options);


    // Adapted from https://github.com/Akryum/vue-cli-plugin-apollo/blob/master/generator/index.js#L68-L91
    api.onCreateComplete(() => {
        // Inject "import axios" into main.js/main.ts
        updateMain(api, (src) => {
            const vueImportIndex = src.findIndex(
                (line) => line.match(/^import Vue/),
            );
            const axiosImportIndex = src.findIndex(
                (line) => line.match(/\/plugins\/axios/),
            );
            if (axiosImportIndex < 0) {
                src.splice(vueImportIndex + 1, 0, "import \"./plugins/axios\"");
            }
            return src;
        });
    });
};
