import { apiClient, gptClient } from "../api/index";

(async () => {
  try {
    const { token } = await apiClient.authorize("inprompt");
    const { input, question } = await apiClient.getTask(token);
    const findName = await gptClient.getCompletion(
      `Based on given question about person. Return me a single word - the person name and nothing more. Question is ${question}. `,
    );
    const name = findName.choices[0].text.replace(/[^\w\s]/gi, "").trim();

    const searchedPerson = (input as string[])?.find(
      (description) => description.indexOf(name) !== -1,
    );

    if (searchedPerson) {
      const gptAnswer = await gptClient.getCompletion(
        `${searchedPerson}. Answer question with a single word. Question: ${question}`,
      );
      const answer = gptAnswer.choices[0].text.replace(/[^\w\s]/gi, "").trim();
      const result = await apiClient.answer(token, answer);
      console.log(result);

      return result;
    }
  } catch (error: any) {
    console.error(error?.message);
  }
})();
