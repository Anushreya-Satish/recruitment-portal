import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "applications.json");

function ensureFileExists() {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
  }
}

export function getApplications() {
  ensureFileExists();
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData || "[]");
}

export function saveApplication(data) {
  ensureFileExists();
  const current = getApplications();
  const newRecord = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...data,
  };
  current.push(newRecord);
  fs.writeFileSync(filePath, JSON.stringify(current, null, 2), "utf-8");
  return newRecord;
}