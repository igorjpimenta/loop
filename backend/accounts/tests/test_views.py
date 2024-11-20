from django.urls import reverse
from rest_framework import status
from unittest.mock import patch
from accounts.tests.test_setup import APITestSetup, User


class UserViewTests(APITestSetup):
    """Test suite for user-related views."""

    @patch('accounts.views.send_welcome_email')
    def test_user_registration_with_email(self, mock_send_email):
        """Test user registration endpoint with welcome email."""
        response = self.client.post(self.register_url, self.user_data)

        # Check response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(
                username=self.user_data['username']
            ).exists()
        )

        # Check if user is logged in
        self.assertTrue('_auth_user_id' in self.client.session)

        # Verify welcome email was called
        mock_send_email.assert_called_once_with(
            self.user_data['email'],
            self.user_data['username']
        )

    def test_user_login(self):
        """Test user login endpoint with session auth."""
        # Create a user first
        User.objects.create_user(**self.user_data)

        # Attempt login
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify session is created
        self.assertTrue('_auth_user_id' in self.client.session)
        # Verify user data is returned
        self.assertEqual(response.data['username'], self.user_data['username'])
        self.assertEqual(response.data['email'], self.user_data['email'])

    def test_user_logout(self):
        """Test user logout endpoint with session auth."""
        # Create and login user
        user = User.objects.create_user(**self.user_data)
        # Ensure the user is authenticated
        self.client.force_authenticate(user=user)
        self.client.force_login(user=user)

        # Verify user is logged in
        self.assertTrue('_auth_user_id' in self.client.session)

        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify session is cleared
        self.assertTrue('_auth_user_id' not in self.client.session)

    def test_login_with_invalid_credentials(self):
        """Test login with wrong credentials."""
        response = self.client.post(self.login_url, {
            'username': 'nonexistent',
            'password': 'wrongpass'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('_auth_user_id' not in self.client.session)

    def test_duplicate_username_registration(self):
        """Test registration with duplicate username."""
        # Create first user
        self.client.post(self.register_url, self.user_data)

        # Attempt to create second user with same username
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserDetailViewTests(APITestSetup):
    """Test suite for user detail view."""

    def setUp(self):
        super().setUp()
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='TestPass123!'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='TestPass123!'
        )

        self.user_detail_url = reverse(
            'user-detail',
            kwargs={'pk': self.user1.pk}
        )

    def test_read_only_access(self):
        """Test user detail endpoint."""
        # Non-authenticated user should get read-only access
        response = self.client.get(self.user_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Non-authenticated user should not be able to modify
        response = self.client.patch(
            self.user_detail_url,
            {'username': 'newname', 'email': self.user1.email},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_self_user_modification(self):
        """Test non-self user modification."""
        # Non-self user should not be able to modify
        self.client.force_authenticate(user=self.user2)
        response = self.client.patch(
            self.user_detail_url,
            {'username': 'newname', 'email': self.user1.email},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_self_user_modification(self):
        """Test self user modification."""
        # Self user should be able to modify
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(
            self.user_detail_url,
            {'username': 'newname', 'email': self.user1.email},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            User.objects.get(pk=self.user1.pk).username,
            'newname'
        )
