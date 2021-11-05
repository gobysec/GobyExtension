const request = require('request');
let jar;
let id = "";

function getJar(index) {
    if (id === index && jar) {
        id = index
        return jar;
    } else {
        jar = request.jar();
        id = index
        return jar;
    }
}

function cleanJar() {
    jar = ""
}

module.exports = {getJar, cleanJar}
