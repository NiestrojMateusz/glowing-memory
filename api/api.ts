import { create, ApiResponse, ApisauceInstance, ApiOkResponse } from "apisauce";
import { AuthorizeResponse, TaskResponse } from "./types";

class ApiClient {
  private readonly api: ApisauceInstance;

  constructor() {
    this.api = create({
      baseURL: "https://zadania.aidevs.pl",
    });
  }

  async authorize(taskName: string): Promise<AuthorizeResponse> {
    const { data, ok, originalError } = await this.api.post<AuthorizeResponse>(
      `/token/${taskName}`,
      {
        apikey: process.env.ZADANIA_API_KEY,
      },
    );

    if (ok) {
      return data!;
    }

    throw originalError;
  }

  async getTask<T = object>(token: string): Promise<TaskResponse<T>> {
    const { data, ok, originalError } = await this.api.get<TaskResponse<T>>(
      `/task/${token}`,
    );

    if (ok) {
      return data!;
    }

    throw originalError;
  }

  async answer(token: string, answer: string | string[] | number[]) {
    const { data, ok, originalError, config } = await this.api.post(
      `/answer/${token}`,
      {
        answer,
      },
    );

    if (ok) {
      return data!;
    }

    console.error(data);
    throw new Error(originalError.message);
  }
}

export default new ApiClient();
