import { WordnikAPI } from "wordnik-api";
import IWord from "../interfaces";

const containsSymbols = (word: string) => {
  const invalidSymbolsRegex = /[-']/;
  return invalidSymbolsRegex.test(word);
};

const getRandomWord = async (): Promise<IWord | null> => {
  const API_KEY = "1co9ij6v2izccfr6r7hdaxyeqb06fdg980emmdah1twp80g6k";
  const wordnik = new WordnikAPI(API_KEY);

  let randomWord: { word: string } | null;
  do {
    randomWord = await wordnik.getRandomWord("true");
  } while (randomWord && containsSymbols(randomWord.word));

  if (randomWord && randomWord.word) {
    const definitions = await wordnik.getDefinitions(randomWord.word);
    if (definitions && definitions.length > 0) {
      const wordObj: IWord = {
        word: randomWord.word,
        definition: definitions[0].text,
      };
      return wordObj;
    }
  }
  return null;
};

export default getRandomWord;
