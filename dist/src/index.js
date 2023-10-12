"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const index_1 = __importDefault(require("./Routes/index"));
const swagger_1 = __importDefault(require("../swagger"));
const connect_db_1 = __importDefault(require("./config/connect.db"));
(0, dotenv_1.config)();
// App Init
const app = (0, express_1.default)();
// Connect to DB
(0, connect_db_1.default)();
// Middlewares
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
// Swagger API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Routes
app.use('/api', index_1.default);
const PORT = Number(process.env.PORT) || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = server;
//# sourceMappingURL=index.js.map