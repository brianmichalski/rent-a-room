import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest } from "next";
import { HttpException } from "next-api-decorators";
import path from "path";

export const parseFormWithFile = (
  req: NextApiRequest,
  fileOutpuDir: string,
  maxFiles: number,
  maxFileSize: number
): Promise<{ fields: Fields; files: Files }> => {
  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), fileOutpuDir);
  fs.mkdirSync(uploadDir, { recursive: true });

  // Configure formidable to use the upload directory
  const _form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: (maxFileSize * 1024 * 1024), // max file size (MB)
    multiples: true,
    maxFiles: maxFiles
  });

  const form = _form;

  // Return a Promise that will resolve or reject based on the parsing result
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        if (err.httpCode === 413) {
          let message = err.message;
          if (err.message.includes('maxFiles')) {
            message = `Limit of files exceeded. The maximum is ${maxFiles} simultaneous pictures.`
          } else if (err.message.includes('maxTotalFileSize')) {
            message = `Payload is too large. The maximum accepted is ${maxFileSize} MB.`
          }
          reject(new HttpException(err.httpCode, message));
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

export const clearEmptyParams = <T extends object>(object: T) => {
  Object.keys(object).forEach(k => {
    const value = object[k as keyof T];
    if (['undefined', '', undefined].includes(value as unknown as any)) {
      delete object[k as keyof T];
    }
  });
  return object;
}