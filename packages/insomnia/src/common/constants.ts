import appConfig from '../../config/config.json';
import { version } from '../../package.json';
import type { MockServer } from '../models/mock-server';
import type { KeyCombination } from './settings';

// Vite is filtering out process.env variables that are not prefixed with VITE_.
const ENV = 'env';

const env = process[ENV];

export const INSOMNIA_GITLAB_REDIRECT_URI = env.INSOMNIA_GITLAB_REDIRECT_URI;
export const INSOMNIA_GITLAB_CLIENT_ID = env.INSOMNIA_GITLAB_CLIENT_ID;
export const INSOMNIA_GITLAB_API_URL = env.INSOMNIA_GITLAB_API_URL;
export const PLAYWRIGHT = env.PLAYWRIGHT;

// App Stuff
export const getSkipOnboarding = () => env.INSOMNIA_SKIP_ONBOARDING;
export const getInsomniaSession = () => env.INSOMNIA_SESSION;
export const getInsomniaSecretKey = () => env.INSOMNIA_SECRET_KEY;
export const getInsomniaPublicKey = () => env.INSOMNIA_PUBLIC_KEY;
export const getInsomniaVaultSalt = () => env.INSOMNIA_VAULT_SALT;
export const getInsomniaVaultKey = () => env.INSOMNIA_VAULT_KEY;
export const getInsomniaVaultSrpSecret = () => env.INSOMNIA_VAULT_SRP_SECRET;
export const getAppVersion = () => version;
export const getProductName = () => appConfig.productName;
export const getAppDefaultTheme = () => appConfig.theme;
export const getAppDefaultLightTheme = () => appConfig.lightTheme;
export const getAppDefaultDarkTheme = () => appConfig.darkTheme;
export const getAppSynopsis = () => appConfig.synopsis;
export const getAppId = () => appConfig.appId;
export const getAppPlatform = () => process.platform;
export const getAppBundlePlugins = () => appConfig.bundlePlugins;
export const isMac = () => getAppPlatform() === 'darwin';
export const isLinux = () => getAppPlatform() === 'linux';
export const isWindows = () => getAppPlatform() === 'win32';
export const getAppEnvironment = () => process.env.INSOMNIA_ENV || 'production';
export const isDevelopment = () => getAppEnvironment() === 'development';
export const getSegmentWriteKey = () =>
  appConfig.segmentWriteKeys[isDevelopment() || env.PLAYWRIGHT ? 'development' : 'production'];
export const getSentryDsn = () => appConfig.sentryDsn;
export const getAppBuildDate = () => new Date(process.env.BUILD_DATE ?? '').toLocaleDateString();

export const getBrowserUserAgent = () =>
  encodeURIComponent(
    String(window.navigator.userAgent)
      .replace(new RegExp(`${getAppId()}\\/\\d+\\.\\d+\\.\\d+ `), '')
      .replace(/Electron\/\d+\.\d+\.\d+ /, ''),
  ).replace('%2C', ',');

export function updatesSupported() {
  // Updates are not supported on Linux
  if (isLinux()) {
    return false;
  }

  // Updates are not supported for Windows portable binaries
  if (isWindows() && process.env['PORTABLE_EXECUTABLE_DIR']) {
    return false;
  }

  return true;
}

export const getClientString = () => `${getAppEnvironment()}::${getAppPlatform()}::${getAppVersion()}`;

// Global Stuff
export const DEBOUNCE_MILLIS = 100;

export const CDN_INVALIDATION_TTL = 10_000; // 10 seconds

export const STATUS_CODE_PLUGIN_ERROR = -222;
export const LARGE_RESPONSE_MB = 5;
export const HUGE_RESPONSE_MB = 100;
export const FLEXIBLE_URL_REGEX =
  /^(http|https):\/\/[\wàâäèéêëîïôóœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ\-_.]+[/\wàâäèéêëîïôóœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ.\-+=:\][@%^*&!#?;$~'(),]*/;
export const CHECK_FOR_UPDATES_INTERVAL = 1000 * 60 * 60 * 24;

export const ACCEPTED_NODE_CA_FILE_EXTS = ['.pem', '.crt', '.cer', '.p12'];

export const LLM_BACKENDS = ['gguf', 'claude', 'openai', 'gemini'] as const;

// Available editor key map
export enum EditorKeyMap {
  default = 'default',
  emacs = 'emacs',
  sublime = 'sublime',
  vim = 'vim',
}

// Hotkey
// For an explanation of mnemonics on linux and windows see https://github.com/Kong/insomnia/pull/1221#issuecomment-443543435 & https://docs.microsoft.com/en-us/cpp/windows/defining-mnemonics-access-keys?view=msvc-160#mnemonics-access-keys
export const MNEMONIC_SYM = isMac() ? '' : '&';

export const displayModifierKey = (key: keyof Omit<KeyCombination, 'keyCode'>) => {
  const mac = isMac();
  switch (key) {
    case 'ctrl': {
      return mac ? '⌃' : 'Ctrl';
    }

    case 'alt': {
      return mac ? '⌥' : 'Alt';
    }

    case 'shift': {
      return mac ? '⇧' : 'Shift';
    }

    case 'meta': {
      if (mac) {
        return '⌘';
      }

      if (isWindows()) {
        // Note: Although this unicode character for the Windows doesn't exist, the Unicode character U+229E ⊞ SQUARED PLUS is very commonly used for this purpose. For example, Wikipedia uses it as a simulation of the windows logo.  Though, Windows itself uses `Windows` or `Win`, so we'll go with `Win` here.
        // see: https://en.wikipedia.org/wiki/Windows_key
        return 'Win';
      }

      // Note: To avoid using a Microsoft trademark, much Linux documentation refers to the key as "Super". This can confuse some users who still consider it a "Windows key". In KDE Plasma documentation it is called the Meta key even though the X11 "Super" shift bit is used.
      // see: https://en.wikipedia.org/wiki/Super_key_(keyboard_button)
      return 'Super';
    }

    default: {
      throw new Error(key + 'unrecognized key');
    }
  }
};

// Oauth redirect URL
export const getOauthRedirectUrl = () => env.OAUTH_REDIRECT_URL || 'https://app.insomnia.rest/oauth/redirect';
export const getOauthRelayUrl = () => env.OAUTH_RELAY_URL || 'https://app.insomnia.rest/oauth/relay';

// API
export const getApiBaseURL = () => env.INSOMNIA_API_URL || 'https://api.insomnia.rest';
export const getMockServiceURL = () => env.INSOMNIA_MOCK_API_URL || 'https://mock.insomnia.run';

export const getMockServiceBinURL = (mockServer: MockServer, path: string) => {
  if (!mockServer.useInsomniaCloud) {
    return `${mockServer.url}/bin/${mockServer._id}${path}`;
  }
  const baseUrl = getMockServiceURL();
  const url = new URL(baseUrl);
  url.host = mockServer._id.replace('_', '-') + '.' + url.host;
  return url.origin + path;
};

export const getAIServiceURL = () => env.INSOMNIA_AI_URL || 'https://ai-helper.insomnia.rest';

// App website
export const getAppWebsiteBaseURL = () => env.INSOMNIA_APP_WEBSITE_URL || 'https://app.insomnia.rest';

// GitHub API
export const getGitHubRestApiUrl = () => env.INSOMNIA_GITHUB_REST_API_URL || 'https://api.github.com';
export const getGitHubGraphQLApiURL = () => env.INSOMNIA_GITHUB_API_URL || `${getGitHubRestApiUrl()}/graphql`;

// SYNC
export const DEFAULT_BRANCH_NAME = 'master';

// PLUGIN
export const PLUGIN_HUB_BASE = 'https://insomnia.rest/plugins';
export const NPM_PACKAGE_BASE = 'https://www.npmjs.com/package';

// UI Stuf
export const MIN_INTERFACE_FONT_SIZE = 8;
export const MAX_INTERFACE_FONT_SIZE = 24;
export const MIN_EDITOR_FONT_SIZE = 8;
export const MAX_EDITOR_FONT_SIZE = 24;
export const DEFAULT_SIDEBAR_SIZE = 25;

// Activities
export type GlobalActivity = 'spec' | 'debug' | 'unittest' | 'home';

export const isWorkspaceActivity = (activity?: string): activity is GlobalActivity =>
  isDesignActivity(activity) || isCollectionActivity(activity);

export const isDesignActivity = (activity?: string): activity is GlobalActivity => {
  switch (activity) {
    case 'spec':
    case 'debug':
    case 'unittest': {
      return true;
    }

    default: {
      return false;
    }
  }
};

export const isCollectionActivity = (activity?: string): activity is GlobalActivity => {
  switch (activity) {
    case 'debug': {
      return true;
    }

    default: {
      return false;
    }
  }
};

export const isValidActivity = (activity: string): activity is GlobalActivity => {
  switch (activity) {
    case 'spec':
    case 'debug':
    case 'unittest':
    case 'home': {
      return true;
    }

    default: {
      return false;
    }
  }
};

// HTTP Methods
export const METHOD_GET = 'GET';
export const METHOD_POST = 'POST';
export const METHOD_PUT = 'PUT';
export const METHOD_PATCH = 'PATCH';
export const METHOD_DELETE = 'DELETE';
export const METHOD_OPTIONS = 'OPTIONS';
export const METHOD_HEAD = 'HEAD';
export const HTTP_METHODS = [
  METHOD_GET,
  METHOD_POST,
  METHOD_PUT,
  METHOD_PATCH,
  METHOD_DELETE,
  METHOD_OPTIONS,
  METHOD_HEAD,
];

// Additional methods
export const METHOD_GRPC = 'GRPC';

// Preview Modes
export const PREVIEW_MODE_FRIENDLY = 'friendly';
export const PREVIEW_MODE_SOURCE = 'source';
export const PREVIEW_MODE_RAW = 'raw';
const previewModeMap = {
  [PREVIEW_MODE_FRIENDLY]: ['Preview', 'Visual Preview'],
  [PREVIEW_MODE_SOURCE]: ['Source', 'Source Code'],
  [PREVIEW_MODE_RAW]: ['Raw', 'Raw Data'],
};
export const PREVIEW_MODES = Object.keys(previewModeMap) as (keyof typeof previewModeMap)[];

// Content Types
export const CONTENT_TYPE_JSON = 'application/json';
export const CONTENT_TYPE_PLAINTEXT = 'text/plain';
export const CONTENT_TYPE_XML = 'application/xml';
export const CONTENT_TYPE_YAML = 'application/yaml';
export const CONTENT_TYPE_EVENT_STREAM = 'text/event-stream';
export const CONTENT_TYPE_EDN = 'application/edn';
export const CONTENT_TYPE_FORM_URLENCODED = 'application/x-www-form-urlencoded';
export const CONTENT_TYPE_FORM_DATA = 'multipart/form-data';
export const CONTENT_TYPE_FILE = 'application/octet-stream';
export const CONTENT_TYPE_GRAPHQL = 'application/graphql';
export const CONTENT_TYPE_OTHER = '';
export const contentTypesMap: Record<string, string[]> = {
  [CONTENT_TYPE_EDN]: ['EDN', 'EDN'],
  [CONTENT_TYPE_FILE]: ['File', 'Binary File'],
  [CONTENT_TYPE_FORM_DATA]: ['Multipart', 'Multipart Form'],
  [CONTENT_TYPE_FORM_URLENCODED]: ['Form', 'Form URL Encoded'],
  [CONTENT_TYPE_GRAPHQL]: ['GraphQL', 'GraphQL Query'],
  [CONTENT_TYPE_JSON]: ['JSON', 'JSON'],
  [CONTENT_TYPE_OTHER]: ['Other', 'Other'],
  [CONTENT_TYPE_PLAINTEXT]: ['Plain', 'Plain'],
  [CONTENT_TYPE_XML]: ['XML', 'XML'],
  [CONTENT_TYPE_YAML]: ['YAML', 'YAML'],
};

export type AuthTypes =
  | 'none'
  | 'apikey'
  | 'oauth2'
  | 'oauth1'
  | 'basic'
  | 'digest'
  | 'bearer'
  | 'ntlm'
  | 'hawk'
  | 'iam'
  | 'netrc'
  | 'asap'
  | 'singleToken';

export const HAWK_ALGORITHM_SHA256 = 'sha256';
export const HAWK_ALGORITHM_SHA1 = 'sha1';

// json-order constants
export const JSON_ORDER_PREFIX = '&';
export const JSON_ORDER_SEPARATOR = '~|';

// Sort Orders
export type SortOrder =
  | 'name-asc'
  | 'name-desc'
  | 'created-asc'
  | 'created-desc'
  | 'http-method'
  | 'type-desc'
  | 'type-asc'
  | 'type-manual';

export const SORT_ORDERS = [
  'type-manual',
  'name-asc',
  'name-desc',
  'created-asc',
  'created-desc',
  'http-method',
  'type-desc',
  'type-asc',
] as const;
export const sortOrderName: Record<SortOrder, string> = {
  'type-manual': 'Manual',
  'name-asc': 'Name Ascending (A-Z)',
  'name-desc': 'Name Descending (Z-A)',
  'created-asc': 'Oldest First',
  'created-desc': 'Newest First',
  'http-method': 'HTTP Method',
  'type-desc': 'Folders First',
  'type-asc': 'Requests First',
};

export const EXTERNAL_VAULT_PLUGIN_NAME = '@kong/insomnia-plugin-external-vault';
export const AI_PLUGIN_NAME = '@kong/insomnia-plugin-ai';

export type DashboardSortOrder = 'name-asc' | 'name-desc' | 'created-asc' | 'created-desc' | 'modified-desc';

export const DASHBOARD_SORT_ORDERS: DashboardSortOrder[] = [
  'modified-desc',
  'name-asc',
  'name-desc',
  'created-asc',
  'created-desc',
];

export const dashboardSortOrderName: Record<DashboardSortOrder, string> = {
  'name-asc': 'Name Ascending (A-Z)',
  'name-desc': 'Name Descending (Z-A)',
  'created-asc': 'Oldest First',
  'created-desc': 'Newest First',
  'modified-desc': 'Last Modified',
};

export type PreviewMode = 'friendly' | 'source' | 'raw';

export function getPreviewModeName(previewMode: PreviewMode, useLong = false) {
  if (previewMode in previewModeMap) {
    return useLong ? previewModeMap[previewMode][1] : previewModeMap[previewMode][0];
  }
  return '';
}
export function getMimeTypeFromContentType(contentType: string) {
  // Check if the Content-Type header is provided
  if (!contentType) {
    return null;
  }

  // Split the Content-Type header to separate MIME type from parameters
  const [mimePart] = contentType.split(';');

  // Trim any extra spaces
  const mimeType = mimePart.trim();

  return mimeType;
}
export function getContentTypeName(contentType?: string | null, useLong = false) {
  if (typeof contentType !== 'string') {
    return '';
  }
  for (const contentTypeKey in contentTypesMap) {
    if (contentType.includes(contentTypeKey) && contentTypeKey.length > 0) {
      return useLong ? contentTypesMap[contentTypeKey][1] : contentTypesMap[contentTypeKey][0];
    }
  }

  return useLong ? contentTypesMap[CONTENT_TYPE_OTHER][1] : contentTypesMap[CONTENT_TYPE_OTHER][0];
}

export function getContentTypeFromHeaders(headers: any[], defaultValue: string | null = null) {
  if (!Array.isArray(headers)) {
    return null;
  }

  const header = headers.find(({ name }) => name.toLowerCase() === 'content-type');
  return header ? header.value : defaultValue;
}

// Sourced from https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export const RESPONSE_CODE_DESCRIPTIONS: Record<number, string> = {
  // Special
  [STATUS_CODE_PLUGIN_ERROR]: 'An Insomnia plugin threw an error which prevented the request from sending',
  // 100s
  100: 'The server has received the request headers and the client should proceed to send the request body.',
  101: 'The server is switching protocols as requested by the client.',
  102: 'The server has received and is processing the request, but no response is available yet.',
  103: 'Used to return some response headers before the final HTTP message.',
  // 200s
  200: 'The request was successful and the server returned the expected response.',
  201: 'The request was successful and a new resource was created.',
  202: 'The request has been accepted for processing, but processing is not yet complete.',
  203: 'The response was successful but the returned information may be from a third party.',
  204: 'The request was successful but there is no response body.',
  205: 'The request was successful and the client should reset the document view.',
  206: 'The server is delivering only part of the resource due to a range request.',
  207: 'Multiple status codes might apply for different parts of the request.',
  208: 'The resource has already been reported and will not be repeated.',
  226: 'The server has fulfilled a GET request using instance manipulations.',
  // 300s
  300: 'Multiple options are available for the requested resource.',
  301: 'The requested resource has been permanently moved to a new URL.',
  302: 'The requested resource has been temporarily moved to a different URL.',
  303: 'The response can be found under a different URL using a GET request.',
  304: 'The resource has not been modified since the last request.',
  305: 'This means requested response must be accessed by a proxy. This response code is not largely supported because of security reasons.',
  306: 'This response code is no longer used and is just reserved currently. It was used in a previous version of the HTTP 1.1 specification.',
  307: 'The resource is temporarily available at a different URL.',
  308: 'The resource is permanently available at a new URL.',
  // 400s
  400: 'The request is invalid or cannot be processed by the server.',
  401: 'Authentication is missing or invalid.',
  402: 'Payment is required to access the requested resource.',
  403: 'The server understood the request but refuses to authorize it.',
  404: 'The requested resource could not be found.',
  405: 'The HTTP method is not supported for this resource.',
  406: 'The server cannot generate a response matching the acceptable values.',
  407: 'Authentication with a proxy server is required.',
  408: 'The server timed out waiting for the request.',
  409: 'The request conflicts with the current state of the resource.',
  410: 'The requested resource is permanently unavailable.',
  411: 'Content-Length header is required.',
  412: 'Preconditions in request headers were not met.',
  413: 'The request payload is too large for the server to process.',
  414: 'The requested URI is too long for the server to process.',
  415: 'The request format is not supported.',
  416: 'The requested range cannot be fulfilled.',
  417: 'The server cannot meet the expectation in the request headers.',
  418: 'The server refuses to brew coffee because it is a teapot. (Easter egg)',
  421: 'The request was sent to the wrong server.',
  422: 'The request is well-formed but contains semantic errors.',
  423: 'The resource is locked.',
  424: 'The request failed due to failure of a previous request.',
  425: 'The server is unwilling to process the request due to replay risk.',
  426: 'The client must switch to a different protocol.',
  428: 'Preconditions are required before processing the request.',
  429: 'The client has sent too many requests in a given amount of time.',
  431: 'Request headers are too large.',
  451: 'Access is denied due to legal restrictions.',
  // 500s
  500: 'The server encountered an unexpected error.',
  501: 'The server does not support the request method.',
  502: 'The server received an invalid response from an upstream server.',
  503: 'The server is currently unable to handle the request.',
  504: 'The server did not receive a timely response from an upstream server.',
  505: 'The HTTP version used is not supported.',
  506: 'Content negotiation error occurred.',
  507: 'The server cannot store the representation needed to complete the request.',
  508: 'The server detected an infinite loop while processing the request.',
  509: 'The server has exceeded the bandwidth specified by the server administrator; this is often used by shared hosting providers to limit the bandwidth of customers.',
  510: 'Further extensions are required to fulfill the request.',
  511: 'Network authentication is required to access the resource.',
  598: 'Used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.',
  599: 'An error used by some HTTP proxies to signal a network connect timeout behind the proxy to a client in front of the proxy.',
};

export const RESPONSE_CODE_REASONS: Record<number, string> = {
  // Special
  [STATUS_CODE_PLUGIN_ERROR]: 'Plugin Error',
  // 100s
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  // 200s
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  // 300s
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'Switch Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  // 400s
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a Teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  // 500s
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended',
  511: 'Network Authentication Required',
  598: 'Network read timeout error',
  599: 'Network Connect Timeout Error',
};

// (ms) curently server timeout is 30s
export const INSOMNIA_FETCH_TIME_OUT = 30_000;

// channel names for real time events (websocket/socket-io/mcp)
export const REALTIME_EVENTS_CHANNELS = {
  READY_STATE: 'readyState',
  NEW_EVENT: 'newEventReceived',
  MCP_NOTIFICATION: 'mcpNotification',
};
