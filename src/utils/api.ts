import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest } from "next";
import { HttpException } from "next-api-decorators";
import path from "path";

export const parseFormWithFile = (
  req: NextApiRequest,
  fileOutpuDir: string
): Promise<{ fields: Fields; files: Files }> => {
  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), fileOutpuDir);
  fs.mkdirSync(uploadDir, { recursive: true });

  // Configure formidable to use the upload directory
  const _form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // max file size (5 MB)
    multiples: true,
  });

  const form = _form;

  // Return a Promise that will resolve or reject based on the parsing result
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        if (err.httpCode === 413) {
          reject(new HttpException(err.httpCode, "File size too large. The maximum accepted is 5MB."));
        } else {
          reject(new HttpException(400, "Invalid input", err as string[]));
        }
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export const parseForm = (req: NextApiRequest): Promise<{ fields: Fields }> => {
  const form = new IncomingForm({});

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields) => {
      if (err) reject(err);
      else resolve({ fields });
    });
  });
};
