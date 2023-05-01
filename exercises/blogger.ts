import { apiClient, gptClient } from "../api/index";
import { TaskResponseWithBlog } from "../api/types";

(async () => {
  try {
    const { token } = await apiClient.authorize("blogger");
    const { blog, msg } = await apiClient.getTask<TaskResponseWithBlog>(token);
    const sectionAnswers = blog?.map((section) => {
      const answer = gptClient.getCompletion(
        `${msg}. Napisz sekcję blog posta w języku polskim na podstawie nagłówka. Kazda sekcja kończy się kropką. Nagłówek: ${section}: `,
        {
          max_tokens: 500,
          temperature: 0.7,
        },
      );

      return answer;
    });

    const resolvedSection = await Promise.all(sectionAnswers);

    const answer = resolvedSection.map((section) => {
      return section.choices[0].text;
    });

    const result = await apiClient.answer(token, answer);
    console.log(result);

    return result;
  } catch (error: any) {
    console.error(error?.message);
  }
})();
