from .click_tracking import ClickTracking
from .open_tracking import OpenTracking
from .subscription_tracking import SubscriptionTracking
from .ganalytics import Ganalytics
from typing import Optional, TypedDict


class TrackingSettingsObject(TypedDict, total=False):
    click_tracking: ClickTracking
    open_tracking: OpenTracking
    subscription_tracking: SubscriptionTracking
    ganalytics: Ganalytics


class TrackingSettings:
    def __init__(
        self,
        click_tracking: Optional[ClickTracking] = None,
        open_tracking: Optional[OpenTracking] = None,
        subscription_tracking: Optional[SubscriptionTracking] = None,
        ganalytics: Optional[Ganalytics] = None,
    ) -> None: ...

    @property
    def click_tracking(self) -> ClickTracking: ...

    @click_tracking.setter
    def click_tracking(self, value: ClickTracking) -> None: ...

    @property
    def open_tracking(self) -> OpenTracking: ...

    @open_tracking.setter
    def open_tracking(self, value: OpenTracking) -> None: ...

    @property
    def subscription_tracking(self) -> SubscriptionTracking: ...

    @subscription_tracking.setter
    def subscription_tracking(self, value: SubscriptionTracking) -> None: ...

    @property
    def ganalytics(self) -> Ganalytics: ...

    @ganalytics.setter
    def ganalytics(self, value: Ganalytics) -> None: ...

    def get(self) -> TrackingSettingsObject: ...
