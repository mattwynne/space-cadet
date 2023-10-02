"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = exports.Position = exports.Source = void 0;
class Source {
    constructor(path) {
        this.path = path;
    }
}
exports.Source = Source;
class UnknownPosition {
    get x() {
        throw new Error("unknown");
    }
    get y() {
        throw new Error("unknown");
    }
}
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Position = Position;
Position.unknown = new UnknownPosition();
class Class {
    constructor(name, source, position) {
        this.name = name;
        this.source = source;
        this.position = position;
    }
}
exports.Class = Class;
//# sourceMappingURL=Class.js.map