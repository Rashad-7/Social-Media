import multer from "multer";

export const fileValidations = {
  image: ["image/jpeg", "image/png", "image/gif"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};
export const uploadCloudFile = ( fileValidation = []) => {

    const storage = multer.diskStorage({})






    function fileFilter(req, file, cb) {
    if (fileValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  }
  return multer({ dest: "temp", fileFilter, storage });
};
