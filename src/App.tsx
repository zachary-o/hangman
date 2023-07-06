import { useState, useEffect } from "react";

import Confetti from "react-confetti";

require("./styles.css");

function App() {
  const [step, setStep] = useState(0);
  const [randomWord, setRandomWord] = useState("dog");
  const [indexes, setIndexes] = useState<number[]>([]);
  const [pressedLetters, setPressedLetters] = useState<string[]>([]);
  const [isWin, setIsWin] = useState(false);

  const alphabet: string[] = "abcdefghijklmnopqrstuvwxyz".split("");
  const words: string[] = ["book", "chair", "table"];

  useEffect(() => {
    const randomWordGenerator = () => {
      const randomWord: string =
        words[Math.floor(Math.random() * words.length)];
      setRandomWord(randomWord);
    };
    randomWordGenerator();
  }, []);

  useEffect(() => {
    const endGame = randomWord.length === indexes.length;
    if (endGame) {
      setIsWin(true);
    } else if (step === 8) {
      alert(`The word was ${randomWord}`);
    }
  }, [indexes, step]);

  const checkLetter = (letter: string) => {
    if (pressedLetters.includes(letter)) {
      return;
    }
    setPressedLetters((prevLetters) => [...prevLetters, letter]);

    if (randomWord.includes(letter)) {
      let indexesArr: number[] = [...indexes];
      for (let i = 0; i < randomWord.length; i++) {
        if (randomWord[i] === letter && !indexes.includes(i)) {
          indexesArr.push(i);
        }
      }
      setIndexes(indexesArr);
    } else if (!randomWord.includes(letter)) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const letterStyling = (letter: string): string => {
    const found = indexes.find((i) => {
      return randomWord[i] === letter;
    });
    if (found !== undefined) {
      return "letter";
    } else {
      return "letter-hidden";
    }
  };

  console.log(step);

  return (
    <div className="App">
      {isWin && <Confetti />}
      <div className="gallows">
        <img src={`./images/${step}.png`} alt="" className="gallows-image" />
      </div>
      <div className="word">
        {randomWord.split("").map((letter, index) => (
          <p key={index} className={letterStyling(letter)}>
            {letter}
          </p>
        ))}
      </div>
      <div className="underscores">
        {Array(randomWord.length)
          .fill("_")
          .map((underscore, index) => (
            <p key={index} className="underscore">
              {underscore}
            </p>
          ))}
      </div>
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
    </div>
  );
}

export default App;
