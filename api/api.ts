import { create, ApiResponse, ApisauceInstance, ApiOkResponse } from "apisauce";
import { AuthorizeResponse, TaskResponse } from "./types";

class ApiClient {
  private readonly api: ApisauceInstance;

  constructor() {
    this.api = create({
      baseURL: "https://zadania.aidevs.pl",
    });
  }

  async retryPolicy(originalRequest: any) {
    const maxRetries = 3;
    let retryCount = 0;
    let error;

    while (retryCount <= maxRetries) {
      try {
        const { data, ok, status, originalError } = await this.api.any(
          originalRequest,
        );

        if (ok || (status && status < 500)) {
          return {
            ok,
            data,
          };
        }

        error = originalError;
        throw originalError;
      } catch (error: any) {
        error = error;
        console.error(`Request failed with error: ${error.message}`);
      }

      retryCount++;
      console.log("Retry request...");
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
    }

    return {
      problem: "NETWORK_ERROR",
      message: "Max retries reached",
      ok: false,
      data: null,
      originalError: error,
      status: null,
    };
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

  async getText(url: string): Promise<any> {
    const originalRequest = {
      method: "GET",
      url: url,
      headers: {
        "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Mozilla/5.0 (Macintosh; Intel Mac`,
      },
    };

    const { ok, data, originalError } = await this.retryPolicy(originalRequest);

    if (ok) {
      return data!;
    }

    throw originalError;
  }
}

export default new ApiClient();
