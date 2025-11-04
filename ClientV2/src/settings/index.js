const date = new Date();
const currentYear = date.getFullYear();
export default {
  // apiInOut: "http://localhost:5017/api/v1/", //public v1//
  // apiInOutv2: "http://localhost:5017/api/v2/", //public v2//
  // apiInOutv4: "http://localhost:5017/api/v4/",
  apiInOut: "https://apigocheckinv4.gosol.com.vn/api/v1/", //public v1//
  apiInOutv2: "https://apigocheckinv4.gosol.com.vn/api/v2/", //public v2//
  apiInOutv4: "https://apigocheckinv4.gosol.com.vn/api/v4/",
  // apiInOut: 'https://apigocheckintest.gosol.com.vn/api/v1/',//public v1 test//
  // apiInOutPublic: 'https://apigocheckintest.gosol.com.vn/api/v2/',//public v2 test//
  // apiInOut: 'https://localhost:44320/api/v1/',//public v1 local//
  // apiInOutPublic: 'https://localhost:44320/api/v2/',//public v1 local//
  // apiImage: 'https://ocrcore.gosol.com.vn/ocr-doc/',
  apiImage: "https://ocrcorev1.gosol.com.vn/ekyc/",
  // apiSocket: "https://apigocheckinv4.gosol.com.vn/SocketHub",
  socketPort: "8000",
  socketAPIPort: "8010",
  scoreCompare: 60,
};
const siteConfig = {
  siteName: "Quản lý vào ra",
  siteIcon: "", //ion-flash
  footerText: `Copyright © 2010-${currentYear} GO SOLUTIONS. All rights`,
};

const themeConfig = {
  topbar: "theme8",
  sidebar: "theme8",
  layout: "theme2",
  theme: "themedefault",
};
const language = "english";
const AlgoliaSearchConfig = {
  appId: "",
  apiKey: "",
};
const Auth0Config = {
  domain: "",
  clientID: "",
  allowedConnections: ["Username-Password-Authentication"],
  rememberLastLogin: true,
  language: "en",
  closable: true,
  options: {
    auth: {
      autoParseHash: true,
      redirect: true,
      redirectUrl: "http://localhost:3000/auth0loginCallback",
    },
    languageDictionary: {
      title: "Isomorphic",
      emailInputPlaceholder: "demo@gmail.com",
      passwordInputPlaceholder: "demodemo",
    },
    theme: {
      labeledSubmitButton: true,
      logo: "",
      primaryColor: "#E14615",
      authButtons: {
        connectionName: {
          displayName: "Log In",
          primaryColor: "#b7b7b7",
          foregroundColor: "#000000",
        },
      },
    },
  },
};
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
};
const googleConfig = {
  apiKey: "", //
};
const mapboxConfig = {
  tileLayer: "",
  maxZoom: "",
  defaultZoom: "",
  center: [],
};
const youtubeSearchApi = "";
export {
  siteConfig,
  themeConfig,
  language,
  AlgoliaSearchConfig,
  Auth0Config,
  firebaseConfig,
  googleConfig,
  mapboxConfig,
  youtubeSearchApi,
};
