import { Router } from "express";
import { Container } from "typedi";
import GDriveController from "@api/controllers/GDriveController";
import AuthSchema from "@api/schemas/AuthSchema";

export default (app) => {
  const gDriveController = new GDriveController(Container);
  const gdriveRoutes = Router();

  /**
   * Google Drive Routes
   */
  app.use("/gdrive", gdriveRoutes);
  const authSchemaI = new AuthSchema(Container);

  gdriveRoutes.get("/authenticate", gDriveController.auth);
  gdriveRoutes.get("/auth/callback", authSchemaI.reqValidation, gDriveController.callbackAuth);
  gdriveRoutes.get("/files", authSchemaI.reqValidation, gDriveController.getFiles);
  gdriveRoutes.get("/files/:id", authSchemaI.reqValidation, gDriveController.getFileDetails);

  gdriveRoutes.post("/files/download/:id", authSchemaI.reqValidation, gDriveController.downloadFile);
  gdriveRoutes.post("/files/watcher/:id", authSchemaI.reqValidation, gDriveController.addWatcher);
  gdriveRoutes.post("/files/notifications", gDriveController.notificationHandler);
};
