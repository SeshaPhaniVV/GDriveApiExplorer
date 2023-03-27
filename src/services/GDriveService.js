import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import OAuthClient from "@models/OAuthClient";
import OAuthAccessToken from "@models/OAuthAccessToken";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default class GDriveService {
  /** @type {import('@loaders/logger')} */
  logger;

  /** @type {OAuth2Client} */
  oauth2Client;

  constructor(container) {
    this.logger = container.get("logger");
  }

  getMimeType(extension) {
    const mimes = [
      ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"],
      ["application/vnd.oasis.opendocument.text", ".odt"],
      ["application/rtf", ".rtf"],
      ["application/pdf", ".pdf"],
      ["text/plain", ".txt"],
      ["application/zip", ".zip"],
      ["application/epub+zip", ".epub"],
      ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"],
      ["application/x-vnd.oasis.opendocument.spreadsheet", ".ods"],
      ["application/pdf", ".pdf"],
      ["application/zip", ".zip"],
      ["text/csv", ".csv"],
      ["text/tab-separated-values", ".tsv"],
      ["application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx"],
      ["application/vnd.oasis.opendocument.presentation", ".odp"],
      ["application/pdf", ".pdf"],
      ["text/plain", ".txt"],
      ["image/jpeg", ".jpg"],
      ["image/png", ".png"],
      ["image/svg+xml", ".svg"],
      ["application/pdf", ".pdf"],
      ["image/jpeg", ".jpg"],
      ["image/png", ".png"],
      ["image/svg+xml", ".svg"],
      ["application/vnd.google-apps.script+json", ".json"],
    ];

    for (let i = 0; i < mimes.length; i++) {
      if (extension === mimes[1]) {
        return mimes[0];
      }
    }

    return "application/pdf";
  }

  async _getClient() {
    const client = await OAuthClient.findOne({ where: { id: 1 } });

    const oauth2Client = new OAuth2Client(client.client_id, client.client_secret);

    const token = await OAuthAccessToken.findOne({
      where: { client_id: client.id },
      order: [["createdAt", "DESC"]],
    });

    const tokenObj = {
      access_token: token.access_token,
      scope: token.scopes.join(" "),
    };

    oauth2Client.setCredentials({
      access_token: tokenObj.access_token,
    });

    return oauth2Client;
  }

  async getFiles() {
    const oauth2Client = await this._getClient();
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const pageLimit = 100;
    let pageToken = null;
    let allFiles = [];

    try {
      do {
        const response = await drive.files.list({
          q: "trashed = false",
          pageSize: pageLimit,
          pageToken: pageToken,
          fields: "nextPageToken, files(id, name)",
        });
        const files = response.data.files;
        allFiles = allFiles.concat(files);
        pageToken = response.data.nextPageToken;
      } while (pageToken && allFiles.length < 1000);

      console.log("All files:", allFiles);
    } catch (error) {
      console.error("The API returned an error:", error.message);
      throw error;
    }

    return allFiles;
  }

  async getFileDetails(payload) {
    const { id: fileId } = payload;
    const oauth2Client = await this._getClient();

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const about = await drive.files.get({ fileId, fields: "id,mimeType,name" });

    const res = await drive.permissions.list({
      fileId: fileId,
      fields: "permissions(emailAddress,role)",
    });

    const { permissions } = res.data;

    return { about: about.data, permissions };
  }

  async downloadFile(payload) {
    const { id: fileId } = payload;

    console.log({ fileId });

    const oauth2Client = await this._getClient();

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const about = await drive.files.get({ fileId, fields: "id,mimeType,name" });

    console.log({ about });

    const p = path.join(__dirname, `../../downloads/${about.data.name}`);
    const ext = about.data.name.split(".").pop();

    const unsupported = [
      "application/vnd.google-apps.folder",
      "application/vnd.google-apps.shortcut",
      "application/vnd.google-apps.drive-sdk",
    ];

    if (unsupported.includes(about.data.mimeType)) {
      throw new Error("Invalid file id passed. It might be one of Folder, shortcut or Thirdparty shortcut");
    }

    const workspaceMimeTypes = [
      "application/vnd.google-apps.audio",
      "application/vnd.google-apps.document",
      "application/vnd.google-apps.drive-sdk",
      "application/vnd.google-apps.drawing",
      "application/vnd.google-apps.file",
      "application/vnd.google-apps.folder",
      "application/vnd.google-apps.form",
      "application/vnd.google-apps.fusiontable",
      "application/vnd.google-apps.jam",
      "application/vnd.google-apps.map",
      "application/vnd.google-apps.photo",
      "application/vnd.google-apps.presentation",
      "application/vnd.google-apps.script",
      "application/vnd.google-apps.shortcut",
      "application/vnd.google-apps.site",
      "application/vnd.google-apps.spreadsheet",
      "application/vnd.google-apps.unknown",
      "application/vnd.google-apps.video",
    ];

    // TODO: @vvs Workspace mimetypes are not fully implemented
    if (workspaceMimeTypes.includes(about.data.mimeType)) {
      const res = await drive.files.export({ fileId, mimeType: this.getMimeType(ext) }, { responseType: "stream" });
      const fileStream = fs.createWriteStream(p);

      res.data.pipe(fileStream);

      return new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });
    } else {
      const fileStream = fs.createWriteStream(p);

      const res = await drive.files.get(
        {
          fileId: fileId,
          alt: "media", // set the 'alt' parameter to 'media' to get the actual content of the file
        },
        { responseType: "stream" }
      );
      res.data.pipe(fileStream);

      return new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });
    }
  }

  async addWatcher(payload) {
    const { id: fileId } = payload;
    const ngrokHost = process.env.NGROK_SERVER_ADDR;
    // latest ngrok address has to be updated
    const watchRequest = {
      kind: "api#channel",
      id: uuidv4(),
      resourceId: fileId,
      type: "web_hook",
      address: `${ngrokHost}/api/gdrive/files/notifications`,
      payload: true,
    };

    const oauth2Client = await this._getClient();
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    await drive.files.watch(
      {
        fileId: fileId,
        resource: watchRequest,
      },
      (err, res) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Watching file for changes...");
          console.log({ res: res.data });
          response = res.data;
        }
      }
    );
  }

  async notificationHandler(req, res) {
    const fileId = new URL(req.headers["x-goog-resource-uri"]).pathname.split("/").filter(Boolean).pop();

    console.log({ fileId });

    // Fetch the updated file metadata
    const permissions = await this.getFileDetails({ id: fileId });
    return permissions;
  }
}
