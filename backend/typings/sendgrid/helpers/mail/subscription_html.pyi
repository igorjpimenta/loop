from typing import Optional


class SubscriptionHtml:
    def __init__(self, subscription_html: Optional[str] = None) -> None: ...

    @property
    def subscription_html(self) -> str: ...

    @subscription_html.setter
    def subscription_html(self, value: str) -> None: ...

    def get(self) -> str: ...
