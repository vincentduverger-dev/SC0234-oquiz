export const config = {
  port: parseInt(process.env.PORT || "3000"),
  jwt_secret: "mon super JWT secret sécurisé",
  isProduction: process.env.NODE_ENV === "production"
};
