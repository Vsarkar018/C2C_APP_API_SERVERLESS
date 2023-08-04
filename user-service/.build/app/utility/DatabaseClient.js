"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const pg_1 = require("pg");
const DBClient = () => {
    return new pg_1.Client({
        host: "127.0.0.1",
        user: "postgres",
        database: "user_service",
        password: "postgres",
        port: 5432,
    });
};
exports.DBClient = DBClient;
//# sourceMappingURL=DatabaseClient.js.map