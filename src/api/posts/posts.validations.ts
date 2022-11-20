import { body, param, query } from "express-validator";

export const validateId = param("id").isInt();

export const validateTitleSearch = query("title")
  .notEmpty()
  .withMessage("Field is required")
  .isLength({ max: 50 })
  .withMessage("Must have a maximum length of 50");

export const validateTitle = body("title")
  .notEmpty()
  .withMessage("Field is required")
  .isLength({ max: 50 })
  .withMessage("Must have a maximum length of 50");

export const validateContent = body("content")
  .notEmpty()
  .withMessage("Field is required");

export const validateHeaderFile = body("headerFile")
  .custom((value, { req }) => {
    if (!req.files || !req.files.headerFile) return true;

    const file = req.files.headerFile;
    const mimetype = file.mimetype;
    if (
      mimetype === "image/jpeg" ||
      mimetype === "image/gif" ||
      mimetype === "image/png" ||
      mimetype === "image/webp" ||
      mimetype === "image/svg+xml"
    )
      return true;
    return false;
  })
  .withMessage("File must be image");
