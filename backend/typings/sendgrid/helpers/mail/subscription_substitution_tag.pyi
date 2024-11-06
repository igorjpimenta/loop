from typing import Optional


class SubscriptionSubstitutionTag:
    def __init__(
        self,
        subscription_substitution_tag: Optional[str] = None,
    ) -> None: ...

    @property
    def subscription_substitution_tag(self) -> str: ...

    @subscription_substitution_tag.setter
    def subscription_substitution_tag(self, value: str) -> None: ...

    def get(self) -> str: ...
