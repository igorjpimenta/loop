from django.db import IntegrityError, DataError
from accounts.tests.test_setup import TransactionTestSetup, User


class UserModelTests(TransactionTestSetup):
    """Test suite for the User model."""

    def test_create_user(self):
        """Test creating a regular user."""
        user = User.objects.create_user(**self.user_data)

        self.assertEqual(user.username, self.user_data['username'])
        self.assertEqual(user.email, self.user_data['email'])
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        """Test creating a superuser."""
        admin_user = User.objects.create_superuser(
            username='admin',
            password=self.user_data['password'],
            email=self.user_data['email'],
        )

        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

    def test_user_str_method(self):
        """Test the string representation of a user."""
        user = User.objects.create_user(
            **self.user_data
        )
        self.assertEqual(str(user), self.user_data['username'])

    def test_user_email_unique(self):
        """Test that user email is unique."""
        User.objects.create_user(
            **self.user_data,
        )
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                username='testuser2',
                password=self.user_data['password'],
                email=self.user_data['email'],
            )

    def test_create_user_missing_email(self):
        """Test that user email is required."""
        with self.assertRaises(TypeError):
            User.objects.create_user(
                username=self.user_data['username'],
                password=self.user_data['password'],
            )

    def test_long_username(self):
        """Test that username is not longer than 50 characters."""
        with self.assertRaises(DataError):
            User.objects.create_user(
                username='a' * 51,
                password=self.user_data['password'],
                email=self.user_data['email'],
            )
