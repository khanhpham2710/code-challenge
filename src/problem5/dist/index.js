"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
const dbPath = process.env.NODE_ENV == "production"
    ? path_1.default.join(__dirname, "..", "data", "db.json")
    : path_1.default.join(__dirname, "data", "db.json");
app.get("/courses", (req, res) => {
    const courses = JSON.parse(fs_1.default.readFileSync(dbPath, "utf-8")).courses;
    res.status(200).json(courses);
});
app.get("/courses/:id", (req, res) => {
    const { id } = req.params;
    const courses = JSON.parse(fs_1.default.readFileSync(dbPath, "utf-8")).courses;
    const index = courses.findIndex((item) => {
        return item.id == Number(id);
    });
    if (index < 0) {
        res.status(404).json({
            message: "Not found",
        });
    }
    res.status(200).json(courses[index]);
});
app.post("/courses", (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        res.status(400).json({
            message: !title
                ? "Please provide a title"
                : "Please provide a description",
        });
        return;
    }
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, "utf-8"));
    const newId = db.courses.length + 1;
    const newCourse = {
        id: newId,
        title,
        description,
    };
    db.courses.push(newCourse);
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json(newCourse);
});
app.put("/courses/:id", (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, "utf-8"));
    const index = db.courses.findIndex((item) => {
        return item.id == Number(id);
    });
    if (index < 0) {
        res.status(404).json({
            message: "Not found",
        });
    }
    else {
        const oldCourse = db.courses[index];
        db.courses[index] = {
            id: Number(id),
            title: title ? title : oldCourse.title,
            description: description ? description : oldCourse.description,
        };
        fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        res.status(200).json({
            message: "Update successfully",
            updatedCourse: db.courses[index],
        });
    }
});
app.delete("/courses/:id", (req, res) => {
    const { id } = req.params;
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, "utf-8"));
    const index = db.courses.findIndex((item) => {
        return item.id == Number(id);
    });
    if (index < 0) {
        res.status(404).json({
            message: "Not found",
        });
    }
    else {
        db.courses = db.courses.filter((item) => item.id != Number(id));
        fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        res.status(200).json({
            message: "Delete successfully",
        });
    }
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
