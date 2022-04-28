"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetState = void 0;
class ResetState {
    resetState;
    constructor(initialState) {
        this.resetState = () => initialState;
    }
}
exports.ResetState = ResetState;
