const fs = require("fs");
const globalConf = require("./config");

let controllerMap = new Map();
let controllerSet = [];

let controllerFiles = fs.readdirSync(globalConf.web_path);

controllerFiles.forEach(function(item) {
    let controller = require(`./${globalConf.web_path}/${item}`);
    if (controller.path) {
        controller.path.forEach(function(value, key) {
            if (controllerMap.get(key)) {
                throw new Error("path repeat" + key);
            }
            controllerMap.set(key, value);
        })
        controllerSet.push(controller);
    }
})

module.exports = controllerMap;