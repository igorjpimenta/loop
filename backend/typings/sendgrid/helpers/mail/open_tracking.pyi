from .open_tracking_substitution_tag import OpenTrackingSubstitutionTag
from typing import TypedDict


class OpenTrackingObject(TypedDict, total=False):
    enable: bool
    substitution_tag: OpenTrackingSubstitutionTag


class OpenTracking:
    def __init__(
        self,
        enable: bool,
        substitution_tag: OpenTrackingSubstitutionTag,
    ) -> None: ...

    @property
    def enable(self) -> bool: ...

    @enable.setter
    def enable(self, value: bool) -> None: ...

    @property
    def substitution_tag(self) -> OpenTrackingSubstitutionTag: ...

    @substitution_tag.setter
    def substitution_tag(self, value: OpenTrackingSubstitutionTag) -> None: ...

    def get(self) -> OpenTrackingObject: ...
