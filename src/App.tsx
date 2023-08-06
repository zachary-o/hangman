import { useState, useEffect } from "react";

import Confetti from "react-confetti";
import getRandomWord from "./utils/getRandomWord";

import IWord from "./interfaces";

require("./styles.css");

function App() {
  const [step, setStep] = useState<number>(0);
  const [indexes, setIndexes] = useState<number[]>([]);
  const [pressedLetters, setPressedLetters] = useState<string[]>([]);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [isLost, setIsLost] = useState<boolean>(false);
  const [randomWordnik, setRandomWordnik] = useState<IWord>({
    word: "",
    definition: "",
  });

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  useEffect(() => {
    const fetchWord = async () => {
      const word = await getRandomWord();
      if (word) {
        console.log("word", word);
        setRandomWordnik(word);
      }
    };
    fetchWord();
  }, []);

  useEffect(() => {
    const endGame = randomWordnik.word.length === indexes.length;
    if (endGame && randomWordnik.word !== "") {
      setIsWin(true);
    } else if (step === 8) {
      setIsLost(true);
    }
  }, [indexes, step]);

  const handleNewGame = () => {
    setStep(0);
    setIndexes([]);
    setIsLost(false);
    setIsWin(false);
    setPressedLetters([]);

    const fetchWord = async () => {
      const word = await getRandomWord();
      if (word) {
        console.log("word", word);
        setRandomWordnik(word);
      }
    };
    fetchWord();
  };

  const checkLetter = (letter: string) => {
    if (pressedLetters.includes(letter)) {
      return;
    }
    setPressedLetters((prevLetters) => [...prevLetters, letter]);

    if (randomWordnik.word.toLowerCase().includes(letter)) {
      let indexesArr = [...indexes];
      for (let i = 0; i < randomWordnik.word.length; i++) {
        if (
          randomWordnik.word[i].toLowerCase() === letter &&
          !indexes.includes(i)
        ) {
          indexesArr.push(i);
        }
      }
      setIndexes(indexesArr);
    } else if (!randomWordnik.word.includes(letter)) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const letterStyling = (letter: string) => {
    const found = indexes.find((i) => {
      return randomWordnik.word[i] === letter;
    });
    if (found !== undefined) {
      return "letter";
    } else {
      return "letter-hidden";
    }
  };

  const cleanDefinition = (definition: string) => {
    definition = definition.replace(/<\/?xref>/g, "");
    definition = definition.replace(/<\/?i>/g, "");
    definition = definition.replace(/<\/?strong>/g, "");
    definition = definition.replace(/<\/?em>/g, "");
    definition = definition.replace(
      /<internalXref(?: urlencoded="[^"]*")?>.*?<\/internalXref>/g,
      ""
    );
    definition = definition.replace(/<\/?em>/g, "");

    return definition;
  };

  return (
    <div className="wrapper">
      {isWin && <Confetti />}
      <div className="gallows">
        <img src={`./images/${step}.png`} alt="" className="gallows-image" />
      </div>
      {isLost ? (
        <h1>
          The word was <span className="hidden-word">{randomWordnik.word}</span>
        </h1>
      ) : (
        <div className="word">
          {randomWordnik.word.split("").map((letter, index) => (
            <div key={index} className="letters">
              <p className={letterStyling(letter)}>{letter}</p>
              <p className="underscore">_</p>
            </div>
          ))}
        </div>
      )}
      <h3 className="definition">
        {cleanDefinition(randomWordnik.definition ?? "")}
      </h3>
      <div className="alphabet">
        {alphabet.map((letter, index) => (
          <button
            key={index}
            className={
              pressedLetters.includes(letter)
                ? "alphabet-button-disabled"
                : "alphabet-button"
            }
            onClick={() => checkLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className="wikipedia-new-game">
        {(isWin || isLost) && (
          <button onClick={handleNewGame} className="new-game-btn">
            New Game
          </button>
        )}
        {(isWin || isLost) && (
          <a
            href={`https://en.wikipedia.org/wiki/${randomWordnik.word}`}
            target="_blank"
            rel="noreferrer"
          >{`Read about ${randomWordnik.word} on Wikipedia`}</a>
        )}
      </div>
    </div>
  );
}

export default App;
