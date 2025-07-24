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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPwd = encryptPwd;
exports.verifyPassword = verifyPassword;
exports.checkPostUserEntry = checkPostUserEntry;
exports.checkPutUserEntry = checkPutUserEntry;
const bcrypt_1 = __importDefault(require("bcrypt"));
function encryptPwd(plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(plainPassword, saltRounds);
        return hashedPassword;
    });
}
function verifyPassword(plainPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcrypt_1.default.compare(plainPassword, hashedPassword);
        return isMatch;
    });
}
const parseUserEntry = (object) => {
    if (!isString(object)) {
        throw new Error('Incorrect entries');
    }
    return object;
};
const isString = (string) => {
    return typeof string === 'string';
};
const parseUserId = (object) => {
    if (typeof object !== 'number' || isNaN(object)) {
        throw new Error('Incorrect entries');
    }
    return object;
};
function checkPostUserEntry(object) {
    const newEntry = {
        name: parseUserEntry(object.name),
        surname: parseUserEntry(object.surname),
        email: parseUserEntry(object.email.toLowerCase()),
        password: parseUserEntry(object.password)
    };
    return newEntry;
}
function checkPutUserEntry(object) {
    const newEntry = {
        id: parseUserId(object.id),
        password: parseUserEntry(object.password),
        newEmail: object.newEmail === undefined ? undefined : parseUserEntry(object.newEmail.toLowerCase()),
        newPassword: object.newPassword === undefined ? undefined : parseUserEntry(object.newPassword)
    };
    return newEntry;
}
