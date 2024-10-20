import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest } from "next";
import path from "path";

export const parseFormWithFile = (req: NextApiRequest, fileOutpuDir: string): Promise<{ fields: Fields, files: Files }> => {
  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), fileOutpuDir);
  fs.mkdirSync(uploadDir, { recursive: true });

  // Configure formidable to use the upload directory
  const _form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // max file size (5 MB)
    multiples: false,             // allows only one file
  });

  const form = _form;
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
