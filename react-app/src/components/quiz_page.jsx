import Result from "./result";
import Quiz from "./quiz";
import Select from 'react-select'
import { toast } from "react-toastify"
import { N_Quiz_Questions } from "../constant";
import { useState, useEffect, useRef } from 'react'
import MakeRequest from "../request";
import { getQuestionids, updateQuestionids } from "../utils";
export default function QuizPage({ set_total_score }) {

    const [quiz_state, set_quiz_state] = useState("ready")
    const [animesoptions, setanimesoptions] = useState()
    const [questions, setquestions] = useState()
    const [selected_anime, setselected_anime] = useState()
    const [quizresults, setquizresults] = useState()
    const [useranswers, setuseranswers] = useState({})
    const [quiz_score, setquiz_score] = useState()
    const [loading, set_loading] = useState(false)
    const anime_select = useRef(null)

    const fetch_animes = async () => {
        const result = await MakeRequest({ path: "animes/" })

        if (result === null) {
            return
        }

        setanimesoptions(
            result.payload.map(anime => ({
                value: anime.id,
                label: anime.name,
                //anime_questions: anime.n_approved_questions
            }))
        )
    }

    const get_quiz = async () => {
        if (loading) {
            return
        }

        setquiz_score()
        setquestions()
        setquizresults()
        const seen_questions = Array.from(getQuestionids())

        set_loading(true)
        const result = await MakeRequest({
            path: `quiz/?anime=${selected_anime.value}`,
            method: "POST",
            request_data: { "ids": seen_questions }
        })
        set_loading(false)

        if (result === null) {
            return
        }

        if (result.status_code === 200) {
            setquestions(result.payload.questions)
            // we should save each question id in answers
            // to keep track of all questions even the ones the user didn't answer.
            const initial_answers = {}
            for (const question of result.payload.questions) {
                initial_answers[question.id] = ""
            }
            setuseranswers(initial_answers)
            set_quiz_state("started")
        }

        if (result.status_code === 404) {
            toast.info(result.payload.msg, { position: "top-center", toastId: "no_quiz" })
        }
    }

    const submit_quiz = async () => {

        set_loading(true)
        const result = await MakeRequest({
            path: `quiz/submit/`,
            method: "POST",
            request_data: { "answers": useranswers }
        })
        set_loading(false)

        if (result === null) {
            return
        }

        const answers = {}
        let quiz_score = 0

        result.payload.answers.forEach((question) => ((
            answers[question.id] = question.right_answer,
            question.right_answer === useranswers[question.id] && (quiz_score += 1)
        )))

        setquiz_score(quiz_score)
        setquizresults(answers)
        set_total_score(prev => prev + quiz_score)

        const new_total_score = JSON.parse(localStorage.getItem("score")) + quiz_score
        localStorage.setItem("score", new_total_score)

        set_quiz_state("end")

        // keep track of seen questions ids
        const seen_questions = questions.map(obj => obj.id);
        updateQuestionids(seen_questions)
    }


    const hide_anime = (n_interactions, anime_active_questions) => {
        if ((anime_active_questions - n_interactions) >= N_Quiz_Questions) {
            return false
        }
        return true
    }

    const on_anime_select = (selected) => {
        setselected_anime(selected)
        anime_select.current.blur()
    }

    useEffect(() => { fetch_animes() }, [])

    return (
        <div className="quiz_page">
            {quiz_state === "ready" &&
                <div className="quiz-ready">
                    <h2>Take 5 MCQs on your favourite anime !</h2>

                    <Select
                        isDisabled={loading}
                        className="react_select"
                        placeholder="select anime"
                        value={selected_anime}
                        isClearable={true}
                        options={animesoptions}
                        isLoading={animesoptions ? false : true}
                        onChange={on_anime_select}
                        ref={anime_select}
                    />

                    <button className="submit_btn" onClick={() => selected_anime ? get_quiz() : anime_select.current.focus()} >
                        {!loading ? "Start" : "loading quiz..."}
                    </button>
                </div>
            }

            {quiz_state == "started" &&
                <Quiz
                    anime={selected_anime.label}
                    questions={questions}
                    useranswers={useranswers}
                    setuseranswers={setuseranswers}
                    submit_quiz={submit_quiz}
                    loading={loading}
                />
            }

            {quiz_state === "end" &&
                <Result
                    results={quizresults}
                    useranswers={useranswers}
                    questions={questions}
                    score={quiz_score}
                    set_quiz_state={set_quiz_state}
                />
            }
        </div>
    )
}
