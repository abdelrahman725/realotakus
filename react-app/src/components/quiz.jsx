import { useState, useEffect } from "react"
import { N_Quiz_Questions } from "../constant"
import { TbSquareRoundedArrowLeftFilled, TbSquareRoundedArrowRightFilled } from "react-icons/tb";
import Question from "./question";

export default function Quiz({ anime, questions, useranswers, setuseranswers, submit_quiz, loading }) {
    const [index, setindex] = useState(0)

    const next_question = () => setindex(prev => Math.min(prev + 1, N_Quiz_Questions - 1))

    const prev_question = () => setindex(prev => Math.max(prev - 1, 0))

    const handleEnterKey = (event, func) => {
        event.key === "Enter" && func()
    }

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ""; // Required for some browsers to show the alert
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <div className="quiz">
            <h2>{anime}</h2>
            <Question
                setuseranswers={setuseranswers}
                question={questions[index]}
                question_index={index}
                useranswers={useranswers}
            />
            <div className="quiz_arrows_btns">
                <TbSquareRoundedArrowLeftFilled
                    onClick={prev_question}
                    onKeyDown={(e) => handleEnterKey(e, prev_question)}
                    className="arrow_icon"
                    title="previous question"
                    style={{ visibility: index > 0 ? 'visible' : 'hidden' }}
                    tabIndex={0}
                />
                <button
                    onClick={submit_quiz}
                    className="submit_btn"
                    style={{ visibility: index === N_Quiz_Questions - 1 ? 'visible' : 'hidden' }}>
                    {!loading ? "Submit" : "Fetching results..."}
                </button>
                <TbSquareRoundedArrowRightFilled
                    onClick={next_question}
                    onKeyDown={(e) => handleEnterKey(e, next_question)}
                    className="arrow_icon"
                    title="next question"
                    style={{ visibility: index < N_Quiz_Questions - 1 ? 'visible' : 'hidden' }}
                    tabIndex={0}
                />
            </div>
        </div>
    )
}

