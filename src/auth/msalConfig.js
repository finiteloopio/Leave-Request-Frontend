import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "f8c8fd17-6264-4e90-8c3d-28fe9a568444", // from Azure App Registration
    authority: "https://login.microsoftonline.com/b48f9e98-0d16-48e9-9525-f40057fe9077",

    redirectUri: "http://localhost:3000", // your frontend URL
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
