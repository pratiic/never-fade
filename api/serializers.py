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
        avatar = data.get("avatar")

        if username and len(username) < 5:
            raise serializers.ValidationError(
                {"username": ["username must be atleast 5 characters"]})

        if password and len(password) < 7:
            raise serializers.ValidationError(
                {"password": ["password must be atleast 7 characters"]})

        if avatar and avatar.size > 5000000:
            raise serializers.ValidationError({ "avatar": ["avatar cannot be more than 5 mb in size"] })

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

    def validate(self, data):
        image = data.get("image")

        if image and image.size > 5000000:
            raise serializers.ValidationError({ "image": ["image cannot be more than 5 mb in size"] })

        return data



class MemorySpaceDetailsSerializer (MemorySpaceSerializer):
    users = UserSerializer(many=True)
    created_by = UserSerializer(many = False)

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

    def validate (self, data):
        image = data.get("image")

        if image.size > 5000000:
            raise serializers.ValidationError({ "image": ["image cannot be more than 5 mb in size"] })

        return data