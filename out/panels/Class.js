"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = exports.Source = void 0;
class Source {
    constructor(path) {
        this.path = path;
    }
}
exports.Source = Source;
class Class {
    constructor(name, source) {
        this.name = name;
        this.source = source;
    }
}
exports.Class = Class;
//# sourceMappingURL=Class.js.map