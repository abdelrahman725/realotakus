from django.urls import path

import main.views

urlpatterns = [
    path("animes/", main.views.get_all_animes),
    path("quiz/animes/", main.views.get_quiz_animes),
    path("quiz/", main.views.get_quiz),
    path("quiz/submit/", main.views.submit_quiz),
    path("question/", main.views.contribute_question),
]