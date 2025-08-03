// swagger/servers.js

import dotenv from "dotenv";
dotenv.config();

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const basePath = process.env.BASE_PATH || "api";
const versionsApi = process.env.VERSIONS_API
  ? process.env.VERSIONS_API.split(",")
  : ["v1"];

const servers = versionsApi.map(version => ({
  url: `${baseUrl}/${basePath}/${version}`,
  description: `URL Server v${version}`,
  variables: {
    basePath: {
      enum: [basePath],
      default: basePath,
    },
    versionApi: {
      enum: [version],
      default: version,
    },
  },
}));

export default servers;
