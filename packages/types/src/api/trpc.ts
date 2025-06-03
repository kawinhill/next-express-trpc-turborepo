// tRPC-related types for the monorepo
export interface TRPCUser {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

export interface TRPCPost {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface TRPCHelloResponse {
  greeting: string;
  timestamp: string;
}

export interface TRPCCreateUserResponse {
  success: boolean;
  user: TRPCUser;
  message: string;
}

export interface TRPCPostsResponse {
  posts: TRPCPost[];
  nextCursor?: number;
  hasMore: boolean;
}

// AppRouter type definition
// This should match the router definition in the server
export interface AppRouter {
  hello: {
    input: { name?: string };
    output: { greeting: string; timestamp: string };
  };
  testError: {
    input: { errorType?: string };
    output: never; // This always throws an error
  };
  getVisitorCount: {
    input: void;
    output: { count: number };
  };
  incrementVisitorCount: {
    input: void;
    output: { count: number };
  };
}
