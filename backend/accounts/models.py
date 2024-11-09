from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
import uuid
from typing import Any, Optional


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is required
    and username is used for authentication.
    """

    def create_user(
        self,
        email: str,
        username: str,
        password: Optional[str] = None,
        **extra_fields: Any
    ) -> 'User':
        """
        Create and save a regular User.

        Args:
            email: User's email address
            username: User's username
            password: User's password
            **extra_fields: Additional fields for the user model

        Returns:
            User: Created user instance

        Raises:
            ValueError: If email is not provided
        """
        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)  # type: ignore
        user.save(using=self._db)

        return user  # type: ignore

    def create_superuser(
        self,
        email: str,
        username: str,
        password: Optional[str] = None,
        **extra_fields: Any
    ) -> 'User':
        """
        Create and save a SuperUser.

        Args:
            email: User's email address
            username: User's username
            password: User's password
            **extra_fields: Additional fields for the user model

        Returns:
            User: Created superuser instance
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model that uses username for authentication
    and requires an email.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, max_length=150)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['-created_at']
        db_table = 'users'
