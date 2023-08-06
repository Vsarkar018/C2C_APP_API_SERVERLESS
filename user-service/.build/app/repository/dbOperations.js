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
exports.DBOperation = void 0;
const DatabaseClient_1 = require("../utility/DatabaseClient");
class DBOperation {
    constructor() { }
    executeQuery(queryString, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield (0, DatabaseClient_1.DBClient)();
            yield client.connect();
            const result = yield client.query(queryString, values);
            yield client.end();
            return result;
        });
    }
}
exports.DBOperation = DBOperation;
//# sourceMappingURL=dbOperations.js.map