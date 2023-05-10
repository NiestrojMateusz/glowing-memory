import { apiClient, gptClient } from "../api/index";
import { TaskResponseWithInputAndQuestion } from "../api/types";

(async () => {
  try {
    const { token } = await apiClient.authorize("scraper");
    const {
      msg,
      input: article,
      question,
    } = await apiClient.getTask<TaskResponseWithInputAndQuestion>(token);

    /**
     * {
  code: 0,
  msg: 'Return answer for the question in POLISH language, based on provided article. Maximum length for the answer is 200 characters',
  input: 'https://zadania.aidevs.pl/text_pizza_history.txt',
  question: 'z którego roku pochodzi łaciński dokument, który pierwszy raz wspomina o pizzy? '
}
     */

    const inputData = await apiClient.getText(article as string);
    const prompt = `${msg}.\n###Article: ${inputData}\n###Pytanie: ${question}: `;
    console.log("Connecting to GPT...", { prompt });

    const gptAnswer = await gptClient.getCompletion(prompt, {
      temperature: 0.7,
      max_tokens: 200,
    });

    console.log(gptAnswer);

    const answer = gptAnswer.choices[0].text;

    const result = await apiClient.answer(token, answer);
    console.log(result);

    return result;
  } catch (error: any) {
    console.error("Error:", error?.message);
  }
})();
