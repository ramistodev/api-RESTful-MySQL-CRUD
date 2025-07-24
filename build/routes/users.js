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
const express_1 = __importDefault(require("express"));
const mysql_1 = require("../mysql/mysql");
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get('/get/all', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Buscamos mediante una funcion todos los usuarios
        const usersList = yield (0, mysql_1.findAllUsers)();
        res.send(usersList);
    }
    catch (e) {
        res.status(404).send({ error: 'Something goes wrong' });
    }
}));
router.get('/get/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +req.params.id;
        // Buscamos mediante una funcion de SQL el usuario por ID
        const user = yield (0, mysql_1.findUser)(userId);
        // Si existe un usuario se muestra, si no da error
        if (user != null) {
            res.send(user);
        }
        else {
            res.status(404).send({ error: 'User not found' });
        }
    }
    catch (e) {
        res.status(404).send({ error: 'Something goes wrong' });
    }
}));
router.post('/post/user/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Analizamos si los datos introducidos son validos
        const newUserEntry = (0, utils_1.checkPostUserEntry)(req.body);
        // Mediante una funcion de SQL metemos el usuario a la base de datos
        const result = yield (0, mysql_1.insertUser)(newUserEntry);
        const newUser = yield (0, mysql_1.findUser)(result[0].insertId);
        if (newUser != null) {
            res.send(newUser);
        }
        else {
            res.status(404).send({ error: 'User not found' });
        }
    }
    catch (e) {
        res.status(404).send({ error: 'Something goes wrong' });
    }
}));
router.delete('/delete/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = +req.params.id;
        // Buscamos si el usuario existe
        const userToDelete = yield (0, mysql_1.findUser)(userId);
        // Si existe lo podemos eliminar
        if (userToDelete != null) {
            const deleteUserFromId = yield (0, mysql_1.deleteUser)(userId);
            res.send(deleteUserFromId);
        }
        else {
            res.status(404).send({ error: 'User not found' });
        }
    }
    catch (e) {
        res.status(404).send({ error: 'Something goes wrong' });
    }
}));
router.put('/put/user/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Analizamos si los datos introducidos son validos
        const updateUserEntry = (0, utils_1.checkPutUserEntry)(req.body);
        const userToUpdate = yield (0, mysql_1.findUser)(updateUserEntry.id);
        if (userToUpdate != null) {
            const updateUserFromId = yield (0, mysql_1.updateUser)(updateUserEntry);
            res.send(updateUserFromId);
        }
        else {
            res.status(404).send({ error: 'User not found' });
        }
    }
    catch (e) {
        res.status(404).send({ error: 'Something goes wrong' });
    }
}));
exports.default = router;
