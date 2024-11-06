from rest_framework.throttling import AnonRateThrottle


class ContributionRateThrottle(AnonRateThrottle):
    scope = "max_contributions_per_anon_user"