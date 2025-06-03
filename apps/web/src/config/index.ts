// Client-side configuration (only NEXT_PUBLIC_ variables are available)
const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
    version: process.env.NEXT_PUBLIC_API_VERSION || "v1",
    trpcUrl:
      process.env.NEXT_PUBLIC_TRPC_URL || "http://localhost:3001/v1/trpc",
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Next.js App",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
  env: {
    nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV || "development",
    isDevelopment: process.env.NEXT_PUBLIC_NODE_ENV === "development",
    isProduction: process.env.NEXT_PUBLIC_NODE_ENV === "production",
  },
  external: {
    analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
} as const;

export default config;

// Helper function to get API endpoint
export const getApiEndpoint = (endpoint: string = ""): string => {
  const baseUrl = `${config.api.baseUrl}/api/${config.api.version}`;
  return endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
};

// Helper function to get full API URL
export const getApiUrl = (path: string = ""): string => {
  const endpoint = getApiEndpoint(path);
  return endpoint;
};
