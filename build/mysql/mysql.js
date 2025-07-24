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
exports.connect = connect;
exports.findAllUsers = findAllUsers;
exports.findUser = findUser;
exports.insertUser = insertUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
const promise_1 = require("mysql2/promise");
const utils_1 = require("../utils");
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = (0, promise_1.createPool)({
            host: 'localhost',
            user: 'username',
            password: 'password',
            database: 'mysql-table',
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0
        });
        return connection;
    });
}
function findAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield connect();
        const [usersList] = yield db.query('SELECT userId, name, surname, email, createDate FROM users;');
        return usersList;
    });
}
function findUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield connect();
        const [rows] = yield db.query('SELECT userId, name, surname, email, createDate FROM users WHERE userId = ?;', [id]);
        const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        return user;
    });
}
function insertUser(newUserEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        // Encriptamos contraseña
        const hashedPassword = yield (0, utils_1.encryptPwd)(newUserEntry.password);
        const db = yield connect();
        const insertedUser = yield db.query('INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?);', [newUserEntry.name, newUserEntry.surname, newUserEntry.email, hashedPassword]);
        return insertedUser;
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield connect();
        yield db.query('DELETE FROM users WHERE userId = ?', [id]);
        return 'User already deleted';
    });
}
function updateUser(updateUserEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield connect();
            // Selecionamos la contraseña del usuario para verificarlo
            const [rows] = yield db.query('SELECT password FROM users WHERE userID = ?', [updateUserEntry.id]);
            const userPassword = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
            // Verificamos si la contraseña del usuario coincide
            const verifyUser = yield (0, utils_1.verifyPassword)(updateUserEntry.password, userPassword.password);
            if (!verifyUser) {
                return { error: 'Wrong password' };
            }
            if (updateUserEntry.newEmail !== undefined) {
                yield db.query('UPDATE users SET email = ? WHERE userId = ?', [updateUserEntry.newEmail, updateUserEntry.id]);
            }
            if (updateUserEntry.newPassword !== undefined) {
                // Encriptamos contraseña
                const hashedPassword = yield (0, utils_1.encryptPwd)(updateUserEntry.newPassword);
                yield db.query('UPDATE users SET password = ? WHERE userId = ?', [hashedPassword, updateUserEntry.id]);
            }
            if (updateUserEntry.newPassword === undefined && updateUserEntry.newEmail === undefined) {
                return { OK: 'Nothing was changes' };
            }
            return { OK: 'User successfully updated' };
        }
        catch (e) {
            throw new Error('Error updating user');
        }
    });
}
