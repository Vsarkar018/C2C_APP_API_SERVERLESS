"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const pg_1 = require("pg");
const DBClient = () => __awaiter(void 0, void 0, void 0, function* () {
    return new pg_1.Client({
        host: "ec2-65-2-190-10.ap-south-1.compute.amazonaws.com",
        user: "user_service",
        database: "user_service",
        password: "user_service123",
        port: 5432,
    });
});
exports.DBClient = DBClient;
//# sourceMappingURL=DatabaseClient.js.map