import type { GetTestResponse } from "./validation";

export type GetTest = () => Promise<GetTestResponse>;

export interface SimpleApiClient {
  getTest: GetTest;
}
