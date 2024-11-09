from django.db.models import Exists, OuterRef, QuerySet
from rest_framework import viewsets
from rest_framework.serializers import BaseSerializer
from rest_framework.request import Request
from typing import Type, Set
from uuid import UUID


class PostActionsMixin(viewsets.ModelViewSet):
    """
    Mixin for adding post actions functionality to a ViewSet.
    Requires the model to have upvoted_by, downvoted_by, and saved_by fields.
    """
    serializer_class: Type[BaseSerializer]
    queryset: QuerySet
    request: Request
    select_related_fields: Set[str] = {'user'}
    prefetch_related_fields: Set[str] = {
        'comments',
        'upvoted_by',
        'downvoted_by'
    }

    def get_queryset(self) -> QuerySet:
        """
        Get optimized queryset with user action annotations.

        Returns:
            QuerySet: Queryset with prefetched relations
                and user action annotations
        """
        queryset = super().get_queryset()

        user = self.request.user
        if user.is_authenticated and user.id:
            queryset = self._annotate_user_actions(queryset, user.id)

        return self._optimize_queryset(queryset)

    def _annotate_user_actions(
        self,
        queryset: QuerySet,
        user_id: UUID
    ) -> QuerySet:
        """
        Add user-specific action annotations to the queryset.

        Args:
            queryset: Base queryset to annotate
            user_id: ID of the user to check actions for

        Returns:
            QuerySet: Queryset with user action annotations
        """
        model = self.queryset.model

        return queryset.annotate(
            is_upvoted=Exists(
                model.upvoted_by.through.objects.filter(
                    post_id=OuterRef('id'),
                    user_id=user_id
                )
            ),
            is_downvoted=Exists(
                model.downvoted_by.through.objects.filter(
                    post_id=OuterRef('id'),
                    user_id=user_id
                )
            ),
            is_saved=Exists(
                model.saved_by.through.objects.filter(
                    post_id=OuterRef('id'),
                    user_id=user_id
                )
            )
        )

    def _optimize_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        Apply performance optimizations to the queryset.

        Args:
            queryset: Base queryset to optimize

        Returns:
            QuerySet: Optimized queryset with prefetched relations
        """
        if self.select_related_fields:
            queryset = queryset.select_related(*self.select_related_fields)

        if self.prefetch_related_fields:
            queryset = queryset.prefetch_related(*self.prefetch_related_fields)

        return queryset

    def get_serializer_class(self) -> Type[BaseSerializer]:
        """
        Get appropriate serializer class based on action.

        Returns:
            Type[BaseSerializer]: Serializer class to use
        """
        if self.action == 'actions':
            from .serializers import PostActionsSummarySerializer

            return PostActionsSummarySerializer

        return super().get_serializer_class()
