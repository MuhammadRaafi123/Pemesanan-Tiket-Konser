import { errorResponse } from "../utils/apiResponse.js";

export const validate = (schema) => {
  return (req, res, next) => {
    // =========================================
    // DEBUG
    // =========================================

    console.log("=================================");
    console.log("VALIDATION DEBUG");
    console.log("METHOD :", req.method);
    console.log("URL    :", req.originalUrl);
    console.log("BODY   :", req.body);
    console.log("FILE   :", req.file);
    console.log("=================================");


    // =========================================
    // VALIDATION
    // =========================================

    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });


    // =========================================
    // VALIDATION ERROR
    // =========================================

    if (!result.success) {
      const errors =
        result.error.issues.map(
          (issue) => ({
            field:
              issue.path.join("."),

            message:
              issue.message,
          })
        );


      return errorResponse(
        res,
        "Validasi gagal",
        400,
        errors
      );
    }


    // =========================================
    // SIMPAN HASIL VALIDASI
    // =========================================

    req.validated =
      result.data;


    next();
  };
};