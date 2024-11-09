from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        read_only_fields = [('id'),]

    def create(self, validated_data):
        """
        Create and return a new User instance, given the validated data.
        Handles password hashing through create_user method.

        Args:
            validated_data: Validated data for creating a user

        Returns:
            User: Created user instance
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login validation."""
    username = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        write_only=True
    )

    def validate(self, attrs):
        """
        Validate user credentials and return user if valid.

        Args:
            attrs: Attributes from the request data

        Returns:
            dict: Validated data with authenticated user added
        """
        username = attrs.get('username', None)
        password = attrs.get('password', None)

        if username and password:
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )

            if not user:
                raise serializers.ValidationError(
                    'Invalid username or password.'
                )

            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')

        else:
            raise serializers.ValidationError(
                'Must include "username" and "password".'
            )

        attrs['user'] = user

        return attrs
