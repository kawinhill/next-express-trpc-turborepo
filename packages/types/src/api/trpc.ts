// AppRouter type definition
// This should match the router definition in the server
export interface AppRouter {
  getVisitorCount: {
    input: void;
    output: { count: number };
  };
  hello: {
    input: { name?: string };
    output: { greeting: string; timestamp: string };
  };
  incrementVisitorCount: {
    input: void;
    output: { count: number };
  };
  testError: {
    input: { errorType?: string };
    output: never; // This always throws an error
  };
}

export interface TRPCCreateUserResponse {
  message: string;
  success: boolean;
  user: TRPCUser;
}

export interface TRPCHelloResponse {
  greeting: string;
  timestamp: string;
}

export interface TRPCPost {
  author: string;
  content: string;
  createdAt: string;
  id: number;
  title: string;
}

export interface TRPCPostsResponse {
  hasMore: boolean;
  nextCursor?: number;
  posts: TRPCPost[];
}

// tRPC-related types for the monorepo
export interface TRPCUser {
  createdAt?: string;
  email: string;
  id: number;
  name: string;
}
