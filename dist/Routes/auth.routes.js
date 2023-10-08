"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../Controllers/auth.controller");
const router = (0, express_1.Router)();
/*@GET /auth/google
 * This route should take care of login and signup
 */
router.get('/google', auth_controller_1.googleAuth);
router.get('/callback', auth_controller_1.callback);
/*@Post /auth/twitter
 *This route should take care of login and signup
 */
router.post('/twitter', auth_controller_1.twitterAuth);
/*@Post /auth/logout
 *This route should take care of login out(clearing the access tokens)
 */
router.post('/logout', auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map