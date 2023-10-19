"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const multer_cloudinary_config_1 = __importDefault(require("../config/multer-cloudinary-config"));
const user_controller_1 = require("../Controllers/user.controller");
const router = (0, express_1.Router)();
/*@GET /user/
 * This route should
 */
router.get('/settings', auth_middleware_1.default, user_controller_1.getUserPreference);
/*@POST /user
 * This route should
 */
router.post('/settings', auth_middleware_1.default, user_controller_1.updateUserPreference);
/*@POST /user
 * This route should
 */
router.put('/update-profile', multer_cloudinary_config_1.default.single('avatar'), auth_middleware_1.default, user_controller_1.updateUserProfile);
/*@POST /user
 * This route should
 */
router.patch('/change-password', auth_middleware_1.default, user_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=user.routes.js.map