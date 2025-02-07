import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Course } from "../types/courses";

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3001;

const dbPath = path.join(__dirname, "..", "data", "db.json")

app.get("/courses", (req: Request, res: Response) => {
  const courses = JSON.parse(fs.readFileSync(dbPath, "utf-8")).courses;
  res.status(200).json(courses);
});

app.get("/courses/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const courses = JSON.parse(fs.readFileSync(dbPath, "utf-8")).courses;

  const index = courses.findIndex((item: Course) => {
    return item.id == Number(id);
  });

  if (index < 0) {
    res.status(404).json({
      message: "Not found",
    });
  }

  res.status(200).json(courses[index]);
});

app.post("/courses", (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({
      message: !title
        ? "Please provide a title"
        : "Please provide a description",
    });
    return;
  }

  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const newId = db.courses.length + 1;

  const newCourse = {
    id: newId,
    title,
    description,
  };

  db.courses.push(newCourse);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(201).json(newCourse);
});

app.put("/courses/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const index = db.courses.findIndex((item: Course) => {
    return item.id == Number(id);
  });

  if (index < 0) {
    res.status(404).json({
      message: "Not found",
    });
  } else {
    const oldCourse = db.courses[index];
    db.courses[index] = {
      id: Number(id),
      title: title ? title : oldCourse.title,
      description: description ? description : oldCourse.description,
    };

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(200).json({
      message: "Update successfully",
      updatedCourse: db.courses[index],
    });
  }
});

app.delete("/courses/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const index = db.courses.findIndex((item: Course) => {
    return item.id == Number(id);
  });

  if (index < 0) {
    res.status(404).json({
      message: "Not found",
    });
  } else {
    db.courses = db.courses.filter((item: Course) => item.id != Number(id));

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(200).json({
      message: "Delete successfully",
    });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
