"use strict";

const {
    updateMain,
} = require("./updater");

module.exports = (api, options) => {
    api.extendPackage({
        devDependencies: {
            axios: "latest",
        },
    });

    api.render({
        "./src/plugins/axios.js": "./templates/plugins/axios.js",
    }, options);


    // adapted from https://github.com/Akryum/vue-cli-plugin-apollo/blob/master/generator/index.js#L68-L91
    api.onCreateComplete(() => {
        // Modify main.js
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
