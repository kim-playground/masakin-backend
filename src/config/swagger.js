const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yaml"));

const swaggerOptions = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Masakin API Documentation",
};

module.exports = {
  swaggerUi,
  swaggerDocument,
  swaggerOptions,
};
