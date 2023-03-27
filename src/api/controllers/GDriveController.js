import BaseController from "@api/controllers/BaseController";

export default class GDriveController extends BaseController {
  /** @type {(import('@services/AuthService').default)} */
  AuthService;

  /** @type {(import('@services/GDriveService').default)} */
  GDriveService;

  constructor(container) {
    super(container);
    this.AuthService = container.get("AuthService");
    this.GDriveService = container.get("GDriveService");
  }

  async auth(req, res, next) {
    try {
      const authUrl = await this.AuthService.authenticate();

      res.redirect(authUrl);
    } catch (err) {
      this.handleError(err, req, res, next);
    }
  }

  async callbackAuth(req, res, next) {
    try {
      await this.AuthService.callbackAuthenticate(req.validatedPayload);

      res.send(`Authentication Successful. Please close the tab.`);
    } catch (err) {
      this.handleError(err, req, res, next);
    }
  }

  async getFiles(req, res, next) {
    try {
      const response = await this.GDriveService.getFiles(req);

      res.status(200).json(response);
    } catch (err) {
      this.handleError(err, req, res, next);
    }
  }

  async getFileDetails(req, res, next) {
    try {
      const response = await this.GDriveService.getFileDetails(req.validatedPayload);
      res.status(201).json(response);
    } catch (err) {
      this.handleError(err, req, res, next);
    }
  }

  async downloadFile(req, res, next) {
    try {
      const response = await this.GDriveService.downloadFile(req.validatedPayload);

      res.status(201).json({ data: "Successfully downloaded the file, check in downloads folder inside codebase" });
    } catch (err) {
      this.handleError(err, req, res, next);
    }
  }

  async addWatcher(req, res, next) {
    try {
      const response = await this.GDriveService.addWatcher(req.validatedPayload);
      res.status(201).json({ data: "Successfully added watcher" });
    } catch (err) {
      this.handleError(err, req, res, next);
    }
  }

  async notificationHandler(req, res, next) {
    try {
      const response = await this.GDriveService.notificationHandler(req, res);
      console.log({ response });
      res.status(201).json(response);
    } catch (err) {
      console.log({ err });
      this.handleError(err, req, res, next);
    }
  }
}
