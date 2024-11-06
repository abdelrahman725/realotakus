N_QUIZ_QUESTIONS = 5  # number of questions in each quiz

QUESTIONS_STATES = [
    ("pending", "pending"),
    ("approved", "approved"),
    ("rejected", "rejected"),
]


def get_prompt(anime_name) -> str:
    return """Create {n_questions} challenging multiple-choice questions for the anime {anime_name}.
    Each question should have four options labeled a, b, c, and d.
    The questions must follow the following 4 rules:

    1- The correct answer MUST always be choice d.
    
    2- The correct answer shouldn't be too obvious at first glance.
    
    3- The question MUST be hard and not trivial.

    4- The output should be a Json object in the following format :
    {{
        "questions": [
            {{
                "question": "question",
                "a": "choice 1",
                "b": "choice 2",
                "c": "choice 3",
                "d": "choice 4",
            }}
        ],...
    }}""".format(
        anime_name=anime_name, n_questions=N_QUIZ_QUESTIONS
    )
