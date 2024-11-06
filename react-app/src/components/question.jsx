export default function Question({
    question,
    question_index,
    useranswers,
    setuseranswers
}) {

    const get_choice_class = (user_answer) => {
        if (useranswers[question.id] === user_answer) {
            return "choice selected_choice"
        }
        return "choice"
    }

    const handle_choice = (user_answer) => {
        setuseranswers((prevAnswers) => ({
            ...prevAnswers,
            [question.id]: user_answer,
        }));
    }

    const handleEnterKey = (event, choice) => {
        event.key === "Enter" && handle_choice(choice)
    }


    return (
        <div className="question_container">
            <p> {question_index + 1}. <strong> {question.question} </strong> </p>

            <div
                className={get_choice_class(question.choice1)}
                onClick={() => handle_choice(question.choice1)}
                onKeyDown={(e) => handleEnterKey(e, question.choice1)}
                tabIndex={0}>
                {question.choice1}
            </div>

            <div
                className={get_choice_class(question.choice2)}
                onClick={() => handle_choice(question.choice2)}
                onKeyDown={(e) => handleEnterKey(e, question.choice2)}
                tabIndex={0}>
                {question.choice2}
            </div>

            <div
                className={get_choice_class(question.choice3)}
                onClick={() => handle_choice(question.choice3)}
                onKeyDown={(e) => handleEnterKey(e, question.choice3)}
                tabIndex={0}>
                {question.choice3}
            </div>

            <div
                className={get_choice_class(question.choice4)}
                onClick={() => handle_choice(question.choice4)}
                onKeyDown={(e) => handleEnterKey(e, question.choice4)}
                tabIndex={0}>
                {question.choice4}
            </div>
        </div>
    )
}