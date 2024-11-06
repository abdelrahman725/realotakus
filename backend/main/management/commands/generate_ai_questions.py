from django.core.management.base import BaseCommand
from main.models import Anime
from main.llm_api import ai_generate_mcqs


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            "anime",
            type=str,
            choices=[anime.name for anime in Anime.objects.all()],
        )

    def handle(self, *args, **options):
        anime_name = options["anime"]
        ai_generate_mcqs(anime_name)
