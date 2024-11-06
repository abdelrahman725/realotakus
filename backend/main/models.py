from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from main.utils import QUESTIONS_STATES


class Anime(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.name


class Question(models.Model):
    anime = models.ForeignKey(
        Anime, on_delete=models.PROTECT, related_name="anime_questions"
    )
    question = models.CharField(max_length=400)
    choice1 = models.CharField(max_length=200)
    choice2 = models.CharField(max_length=200)
    choice3 = models.CharField(max_length=200)
    right_answer = models.CharField(max_length=200)
    date_created = models.DateTimeField(default=timezone.now)
    is_contribution = models.BooleanField(default=False)
    state = models.CharField(choices=QUESTIONS_STATES, max_length=20, default="pending")
    ai_generated = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["anime", "question"], name="unique question for each anime"
            ),
        ]
        ordering = ["-id"]

    def __str__(self):
        if len(self.question) > 60:
            return f"{self.question[:55]}..."
        return self.question
