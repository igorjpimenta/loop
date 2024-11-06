from .subscription_text import SubscriptionText
from .subscription_html import SubscriptionHtml
from .subscription_substitution_tag import SubscriptionSubstitutionTag
from typing import TypedDict


class SubscriptionTrackingObject(TypedDict, total=False):
    enable: bool
    text: SubscriptionText
    html: SubscriptionHtml
    substitution_tag: SubscriptionSubstitutionTag


class SubscriptionTracking:
    def __init__(
        self,
        enable: bool,
        text: SubscriptionText,
        html: SubscriptionHtml,
        substitution_tag: SubscriptionSubstitutionTag,
    ) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    @property
    def text(self) -> SubscriptionText: ...

    @text.setter
    def text(self, value: SubscriptionText) -> None: ...

    @property
    def html(self) -> SubscriptionHtml: ...

    @html.setter
    def html(self, value: SubscriptionHtml) -> None: ...

    @property
    def substitution_tag(self) -> SubscriptionSubstitutionTag: ...

    @substitution_tag.setter
    def substitution_tag(self, value: SubscriptionSubstitutionTag) -> None: ...

    def get(self) -> SubscriptionTrackingObject: ...
