from rest_framework.test import APIClient
from accounts.serializers import UserSerializer, UserLoginSerializer
from accounts.tests.test_setup import TestSetup, User


class UserSerializerTests(TestSetup):
    """Test suite for UserSerializer."""

    def setUp(self):
        super().setUp()
        self.serializer = UserSerializer(data=self.user_data)

    def test_valid_serializer(self):
        """Test serializer with valid data."""
        self.assertTrue(self.serializer.is_valid())

    def test_password_validation(self):
        """Test password validation in serializer."""
        data = self.user_data.copy()
        data['password'] = '123'  # Too short password
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)


class UserLoginSerializerTests(TestSetup):
    """Test suite for UserLoginSerializer."""

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            **self.user_data
        )
        self.client = APIClient()

    def test_valid_login_data(self):
        """Test login serializer with valid credentials."""
        serializer = UserLoginSerializer(data={
            'username': 'testuser',
            'password': 'TestPass123!'
        })
        self.assertTrue(serializer.is_valid())
        # Verify user is in validated data
        self.assertEqual(serializer.validated_data['user'], self.user)

    def test_invalid_login_data(self):
        """Test login serializer with invalid credentials."""
        serializer = UserLoginSerializer(data={
            'username': 'testuser',
            'password': 'wrongpass'
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
