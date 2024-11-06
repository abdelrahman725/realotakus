from rest_framework import serializers

from main.models import Anime
from main.models import Question


class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = ("id", "name")


class AnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "right_answer")
