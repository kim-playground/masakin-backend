const ApiError = require("../utils/ApiError");

/**
 * Middleware factory to validate requests using Joi schemas
 * @param {Object} schema - Joi schema object with body, params, query properties
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // Return all errors
      allowUnknown: true, // Allow unknown keys that will be ignored
      stripUnknown: true, // Remove unknown keys
    };

    // Validate body
    if (schema.body) {
      const { error, value } = schema.body.validate(
        req.body,
        validationOptions,
      );
      if (error) {
        const message = error.details
          .map((detail) => detail.message)
          .join(", ");
        throw new ApiError(400, message, "VALIDATION_ERROR");
      }
      req.body = value;
    }

    // Validate params
    if (schema.params) {
      const { error, value } = schema.params.validate(
        req.params,
        validationOptions,
      );
      if (error) {
        const message = error.details
          .map((detail) => detail.message)
          .join(", ");
        throw new ApiError(400, message, "VALIDATION_ERROR");
      }
      req.params = value;
    }

    // Validate query
    if (schema.query) {
      const { error, value } = schema.query.validate(
        req.query,
        validationOptions,
      );
      if (error) {
        const message = error.details
          .map((detail) => detail.message)
          .join(", ");
        throw new ApiError(400, message, "VALIDATION_ERROR");
      }
      req.query = value;
    }

    next();
  };
};

module.exports = validate;
