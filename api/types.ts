export type AuthorizeResponse = {
  code: number;
  message: string;
  token: string;
};

export type TaskResponse<T = object> = {
  code: number;
  msg: string;
} & T;

export type InputType = {
  input: string | string[];
};

export type QuestionType = {
  question?: string;
};

export type BlogType = {
  blog: string[];
};

export type TaskResponseWithInput = TaskResponse<InputType>;
export type TaskResponseWithQuestion = TaskResponse<QuestionType>;
export type TaskResponseWithInputAndQuestion = TaskResponse<
  InputType & QuestionType
>;

export type TaskResponseWithBlog = TaskResponse<BlogType>;

type ModerationResult = {
  flagged: boolean;
  categories: object;
  category_scores: object;
};

export type ModerationResponse = {
  id: string;
  model: string;
  results: ModerationResult[];
};

export type OpenAICompletionOptions = {
  model?: string;
  prompt?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  logprobs?: null;
  stop?: string;
};

export type CompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: any;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};
