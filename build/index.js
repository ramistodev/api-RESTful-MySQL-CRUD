"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// MiddleWare
app.use((0, morgan_1.default)('dev'));
const PORT = 3000;
app.get('/', (_req, res) => {
    res.send('Todo OKAY');
});
app.use('/api/', users_1.default);
app.listen(PORT, () => {
    console.log(`Server Running On Port: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
