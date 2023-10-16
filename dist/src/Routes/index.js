"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const event_routes_1 = __importDefault(require("./event.routes"));
const group_routes_1 = __importDefault(require("./group.routes"));
const comment_routes_1 = __importDefault(require("./comment.routes"));
/**
 * Main routes
 */
router.use('/auth', auth_routes_1.default);
router.use('/user', user_routes_1.default);
router.use('/events', event_routes_1.default);
router.use('/groups', group_routes_1.default);
router.use('/comments', comment_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map