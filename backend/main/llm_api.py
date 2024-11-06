import os
import logging
from typing import List, Dict
from dotenv import load_dotenv
import cohere
import json
from main.utils import get_prompt
from main.models import Question, Anime

# Load the environment variables from .env file
load_dotenv()

MODEL_NAME = os.getenv("COHERE_MODEL_NAME")
API_KEY = os.getenv("COHERE_API_KEY")

co = cohere.ClientV2(API_KEY)


def ai_generate_mcqs(
    anime_name: str,
) -> None:
    prompt = get_prompt(anime_name)
    try:
        response = co.chat(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            response_format={
                "type": "json_object",
            },
        )
        # check if response is successfull
        if response.finish_reason != "COMPLETE":
            logging.info(f"\n{response.finish_reason}\n")
            return
    except Exception:
        logging.exception("error while fetching")
        return

    parsed_result: Dict[str, List[Dict[str, str]]] = json.loads(
        response.message.content[0].text
    )

    print(parsed_result)

    anime = Anime.objects.get(name=anime_name)
    question_instances = [
        Question(
            anime=anime,
            question=question["question"],
            choice1=question["a"],
            choice2=question["b"],
            choice3=question["c"],
            right_answer=question["d"],
            ai_generated=True,
        )
        for question in parsed_result["questions"]
    ]

    Question.objects.bulk_create(question_instances)
