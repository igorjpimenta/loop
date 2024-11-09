from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj) -> bool:
        """
        Check if user has permission to access object.

        Args:
            request: The request being made
            view: The view handling the request
            obj: The object being accessed

        Returns:
            bool: True if user has permission, False otherwise
        """
        return bool(
            request.method in permissions.SAFE_METHODS or
            request.user and
            request.user.is_authenticated and
            obj.user == request.user
        )


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    """

    def has_permission(self, request, view) -> bool:
        """
        Check if user has permission to access view.

        Args:
            request: The request being made
            view: The view handling the request

        Returns:
            bool: True if user has permission, False otherwise
        """
        return bool(
            request.method in permissions.SAFE_METHODS or
            request.user and
            request.user.is_staff
        )
