import math

from django.db import models
from django.db.models import Q
from django.contrib import admin
from django.contrib.auth.models import Group
from django.utils import timezone
from django.forms import Textarea

from main.models import Anime
from main.models import Question

admin.site.unregister(Group)


class ContributionTypeFilter(admin.SimpleListFilter):
    title = "state"
    parameter_name = "state"

    def lookups(self, request, model_admin):
        return (
            ("t", ("Admin")),
            ("c", ("Contribution")),
            ("p", ("Pending")),
            ("r", ("Reviewed")),
            ("a", ("Approved")),
            ("f", ("Rejected")),
        )

    def queryset(self, request, queryset):
        if self.value() == "t":
            return queryset.filter(is_contribution=False)

        if self.value() == "c":
            return queryset.filter(is_contribution=True)

        if self.value() == "p":
            return queryset.filter(state="pending", is_contribution=True)

        if self.value() == "r":
            return queryset.filter(~Q(state="pending"), is_contribution=True)

        if self.value() == "a":
            return queryset.filter(state="approved", is_contribution=True)

        if self.value() == "f":
            return queryset.filter(state="rejected", is_contribution=True)


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )

    search_fields = ("name",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    fields = (
        "anime",
        "question",
        "right_answer",
        "choice1",
        "choice2",
        "choice3",
        "state",
        "is_contribution",
        "date_created",
    )

    readonly_fields = ("date_created",)

    formfield_overrides = {
        models.CharField: {"widget": Textarea(attrs={"rows": 7, "cols": 50})},
    }

    list_display = (
        "pk",
        "anime",
        "question",
        "contributor",
        "state",
        "created",
    )

    list_editable = ("state", )
    list_display_links = ("question",)
    list_max_show_all = 2000

    list_filter = (
        ContributionTypeFilter,
        ("anime", admin.RelatedOnlyFieldListFilter),
        "date_created",
    )

    def contributor(self, obj):
        if not obj.is_contribution:
            return "ADMIN"
        return obj.contributor

    def created(self, obj):
        time_diff = timezone.now() - obj.date_created

        if time_diff.days >= 365:
            return f"{math.floor(time_diff.days/365)} years ago"

        if time_diff.days >= 30:
            return f"{math.floor(time_diff.days/30)} months ago"

        if time_diff.days >= 1:
            return f"{time_diff.days} days ago"

        if time_diff.seconds >= 3600:
            return f"{math.floor(time_diff.seconds/3600)} hours ago"

        if time_diff.seconds > 60:
            return f"{math.floor(time_diff.seconds/60)} minutes ago"

        return "few seconds ago"
