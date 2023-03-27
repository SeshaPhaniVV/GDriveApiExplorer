import { google } from "googleapis";
import * as url_1 from "url";
import OAuthClient from "@models/OAuthClient";
import OAuthAccessToken from "@models/OAuthAccessToken";

export default class AuthService {
  /** @type {import('@loaders/logger')} */
  logger;

  constructor(container) {
    this.logger = container.get("logger");
  }

  async authenticate() {
    const client = await OAuthClient.findOne({ where: { id: 1 } });

    const oauth2Client = new google.auth.OAuth2(client.client_id, client.client_secret, client.redirect_uris[0]);
    const redirectUri = new url_1.URL(client.redirect_uris[0]);
    const scopes = [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive.photos.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      redirect_uri: redirectUri.toString(),
      access_type: "offline",
      scope: scopes.join(" "),
    });

    return authUrl;
  }

  async callbackAuthenticate(payload) {
    const client = await OAuthClient.findOne({ where: { id: 1 } });

    const oauth2Client = new google.auth.OAuth2(client.client_id, client.client_secret, client.redirect_uris[0]);

    const { code } = payload;
    const { tokens } = await oauth2Client.getToken(code);

    const tokenPayload = {
      client_id: client.id,
      access_token: tokens.access_token,
      scopes: tokens.scope.split(" "),
      expires: tokens.expiry_date,
    };

    await OAuthAccessToken.upsert(tokenPayload);
    oauth2Client.setCredentials(tokens);

    return tokens;
  }
}
