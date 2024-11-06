import random

from django.db import IntegrityError
from django.db.models import Count, Q
from django.core.exceptions import ValidationError
from django.conf import settings
from django.views.decorators.cache import cache_page

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, throttle_classes, permission_classes

from main.models import Anime
from main.models import Question

from main.serializers import AnimeSerializer
from main.serializers import AnswersSerializer

from main.throttles import ContributionRateThrottle
from main.utils import N_QUIZ_QUESTIONS


@cache_page(settings.ANIMES_CACHE_TIMEOUT)
@api_view(["GET"])
def get_all_animes(request):
    all_animes = AnimeSerializer(Anime.objects.all(), many=True)
    return Response(all_animes.data)


@api_view(["GET"])
def get_quiz_animes(request):
    quiz_animes = AnimeSerializer(
        Anime.objects.annotate(
            n_approved_questions=Count(
                "anime_questions", filter=Q(anime_questions__state="approved")
            )
        ),
        many=True,
    )
    return Response(quiz_animes.data)


@api_view(["POST"])
@throttle_classes([ContributionRateThrottle])
@permission_classes([IsAuthenticated])
def contribute_question(request):
    contribution = request.data["question"]
    contribution_anime = request.data["anime"]
    try:
        new_contribution = Question(
            anime_id=contribution_anime,
            is_contribution=True,
            question=contribution["question"],
            right_answer=contribution["rightanswer"],
            choice1=contribution["choice1"],
            choice2=contribution["choice2"],
            choice3=contribution["choice3"],
        )
        new_contribution.save()

    except IntegrityError as error:
        if "FOREIGN KEY" or "NOT NULL" in str(error.__cause__):
            return Response({"msg": "anime doesn't exist"}, status=status.HTTP_410_GONE)
        return Response(
            {"msg": "question alreay exists"}, status=status.HTTP_409_CONFLICT
        )

    except ValidationError:
        return Response(
            {"msg": "bad format question"}, status=status.HTTP_400_BAD_REQUEST
        )

    return Response(
        {"msg": "question created successfully"}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
def get_quiz(request):
    import time
    time.sleep(2)
    anime_id = request.GET.get("anime")
    seen_questions_ids = request.data["ids"] or {}
    # ai_generated = request.GET.get("ai") == "true" or False
    questions = (
        Question.objects.filter(anime_id=int(anime_id), state="approved")
        .exclude(id__in=seen_questions_ids)
        .order_by("?")[:N_QUIZ_QUESTIONS]
    )

    if len(questions) != N_QUIZ_QUESTIONS:
        return Response(
            {"msg": "Sorry, No enough available questions for this anime"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serialized_questions = []

    for question in questions:
        question_choices = [
            question.choice1,
            question.choice2,
            question.choice3,
            question.right_answer,
        ]

        random.shuffle(question_choices)

        serialized_questions.append(
            {
                "id": question.id,
                "question": question.question,
                "choice1": question_choices[0],
                "choice2": question_choices[1],
                "choice3": question_choices[2],
                "choice4": question_choices[3],
            }
        )

    return Response({"questions": serialized_questions})


@api_view(["POST"])
def submit_quiz(request):
    user_answers = request.data["answers"]
    questions = AnswersSerializer(
        Question.objects.filter(id__in=user_answers.keys()), many=True
    )
    return Response({"answers": questions.data})
