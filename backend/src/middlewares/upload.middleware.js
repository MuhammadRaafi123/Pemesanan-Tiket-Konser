import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (file.fieldname === "poster") {
      uploadPath = "uploads/posters";
    } else if (file.fieldname === "photo") {
      uploadPath = "uploads/artists";
    } else if (file.fieldname === "proof_image") {
      uploadPath = "uploads/payments";
    } else {
      uploadPath = "uploads";
    }

    fs.mkdirSync(uploadPath, {
      recursive: true,
    });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const extension = path.extname(
      file.originalname
    );

    cb(
      null,
      `${file.fieldname}-${uniqueName}${extension}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format file harus JPG, JPEG, PNG, atau WEBP"
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});