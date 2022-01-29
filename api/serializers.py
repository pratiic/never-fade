from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Memory, User, Image, MemorySpace


class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "avatar", "password"]

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if username and len(username) < 5:
            raise serializers.ValidationError(
                {"username": ["username must be atleast 5 characters"]})

        if password and len(password) < 7:
            raise serializers.ValidationError(
                {"password": ["password must be atleast 7 characters"]})

        return data


class UserSerializerWithToken (UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "avatar", "token", "password"]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class MemorySpaceSerializer (serializers.ModelSerializer):
    class Meta:
        model = MemorySpace
        fields = "__all__"


class MemorySpaceDetailsSerializer (MemorySpaceSerializer):
    users = UserSerializer(many=True)

    class Meta:
        model = MemorySpace
        fields = "__all__"


class MemorySerializer (serializers.ModelSerializer):

    class Meta:
        model = Memory
        fields = "__all__"


class MemoryDetailsSerializer (MemorySerializer):
    owner = UserSerializer(many=False)
    shared_with = UserSerializer(many=True)
    memory_space = MemorySpaceSerializer(many=False)

    class Meta:
        model = Memory
        fields = "__all__"


class ImageSerializer (serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = "__all__"
