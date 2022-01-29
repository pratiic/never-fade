from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from dateutil import parser

from .models import Memory, User, Image, MemorySpace
from .serializers import MemorySerializer, UserSerializer, UserSerializerWithToken, ImageSerializer, MemoryDetailsSerializer, MemorySpaceSerializer, MemorySpaceDetailsSerializer

# Create your views here.


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for key, value in serializer.items():
            data[key] = value

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
def register(request):
    serializer = UserSerializerWithToken(data=request.data)

    try:
        if serializer.is_valid():
            user = serializer.save()
            user.password = make_password(user.password)
            user.save()

            return Response({"user": serializer.data})
        else:
            return Response({"errors": serializer.errors})
    except:
        return Response({}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = User.objects.find(id=request.user.id)
    serializer = UserSerializer(user)
    return Response({"user": serializer.data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def search_user(request):
    query = request.query_params["query"].strip()

    if query == "":
        return Response({"error": "provide a search query"}, status=status.HTTP_400_BAD_REQUEST)

    users = User.objects.filter(Q(username__icontains=query) | Q(
        email__icontains=query)).exclude(id=request.user.id)
    serializer = UserSerializer(users, many=True)

    return Response({"users": serializer.data})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    user = User.objects.get(id=user_id)

    if request.user != user:
        return Response({"error": "unauthorized"})

    try:
        serializer = UserSerializerWithToken(
            user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"user": serializer.data})
        else:
            return Response({"errors": serializer.errors})
    except:
        return Response({})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def change_user_password(request, user_id):
    user = None

    try:
        user = User.objects.get(id=user_id)
    except:
        return Response({"error": "not found"})

    if request.user != user:
        return Response({"error": "unathorized"})

    if check_password(request.data["current_password"], user.password):
        serializer = UserSerializerWithToken(
            user, data={"password": request.data["new_password"]}, partial=True)

        if serializer.is_valid():
            user = serializer.save()
            user.password = make_password(request.data["new_password"])
            user.save()
            return Response({"user": serializer.data})
        else:
            return Response({"errors": serializer.errors})
    else:
        return Response({"error": "the current password is incorrect"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_memories(request):
    # is_guest = request.query_params["guest"]
    # memories = Memory.objects.filter(
    #     owners__id=request.user.id) if is_guest == "false" else Memory.objects.filter(guests__id=request.user.id)
    memories = None
    memory_space = request.query_params.get("memory-space")

    if memory_space:
        memories = Memory.objects.filter(Q(memory_space=memory_space) & Q(
            memory_space__users__id=request.user.id))
    else:
        memories = Memory.objects.filter(
            owner=request.user.id).filter(memory_space=None)
    serializer = MemorySerializer(memories, many=True)
    return Response({"memories": serializer.data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_shared_memories(request):
    type = request.query_params["type"]
    query = None

    if type == "with me":
        query = ~Q(owner=request.user.id) & Q(shared_with__id=request.user.id)
    elif type == "by me":
        query = Q(owner=request.user.id) & Q(shared=True)

    memories = Memory.objects.filter(query)
    serializer = MemorySerializer(memories, many=True)

    return Response({"memories": serializer.data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_memory(request):
    image = request.data.get("images")
    images = None

    if image:
        images = request.FILES.getlist("images")
        request.data.pop("images")

    serializer = MemorySerializer(data=request.data)

    if serializer.is_valid():
        memory = serializer.save()
        memory.owner = request.user

        if not memory.date:
            memory.date = memory.created_at

        if images:
            memory.preview = images[0]

            for image in images:
                image_serializer = ImageSerializer(
                    data={"memory": memory.id, "image": image})

                if image_serializer.is_valid():
                    newImg = image_serializer.save()
                else:
                    memory.delete()
                    return Response({"errors": image_serializer.errors})
                # newImg = Image.objects.create(memory=memory, image=image)

        memory.save()

        return Response({"memory": serializer.data}, status=201)
    else:
        return Response({"errors": serializer.errors})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_memory_details(request, memory_id):
    memory = None

    try:
        memory = Memory.objects.get(id=memory_id)
    except:
        return Response({"error": "not found"}, status=404)

    if (memory.memory_space):
        if request.user not in memory.memory_space.users.all():
            return Response({"error": "unauthorized"})
    else:
        if memory.owner != request.user and request.user not in list(memory.shared_with.all()):
            return Response({"error": "unauthorized"}, status=400)

    try:
        images = Image.objects.filter(memory=memory)
        serializer = MemoryDetailsSerializer(memory)
        imageSerializer = ImageSerializer(images, many=True)
        return Response({"memory": serializer.data, "images": imageSerializer.data})
    except:
        return Response({})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def edit_memory(request, memory_id):
    memory = None

    try:
        memory = Memory.objects.get(id=memory_id)
    except:
        return Response({"error": "not found"}, status=404)

    if memory.owner.id != request.user.id:
        return Response({"error": "unauthorized"})

    try:
        serializer = MemorySerializer(memory, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"memory": serializer.data})

        return Response({"errors": serializer.errors}, status=400)
    except:
        return Response({"error": "memory not found"}, status=404)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def share_memory(request, memory_id):
    memory = Memory.objects.get(id=memory_id)
    userIDs = request.data["shared_with"]

    if memory.owner.id != request.user.id:
        return Response({"error": "unauthorized"})

    try:
        for userID in userIDs:
            memory.shared_with.add(userID)

        memory.shared = True
        memory.save()
        serializer = MemoryDetailsSerializer(memory)

        return Response({"memory": serializer.data})
    except:
        return Response({})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_memory(request):
    query = request.query_params["query"]
    memories = Memory.objects.filter(
        Q(title__icontains=query) | Q(description__icontains=query) | Q(date__icontains=query)).filter(Q(owner=request.user) | Q(memory_space__users__id=request.user.id))
    serializer = MemorySerializer(memories, many=True)
    return Response({"memories": serializer.data})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_memory(request, memory_id):
    memory = Memory.objects.get(id=memory_id)

    if memory.owner.id != request.user.id:
        return Response({"error": "unauthorized"})

    memory.delete()

    return Response({})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_images(request, memory_id):
    memory = Memory.objects.get(id=memory_id)

    if memory.memory_space:
        if request.user not in memory.memory_space.users.all():
            return Response({"error": "unauthorized"})
    else:
        if memory.owner.id != request.user.id:
            return Response({"error": "unauthorized"})

    images = request.FILES.getlist("images")
    serialized_images = []

    if images:
        for image in images:
            newImg = Image.objects.create(memory=memory, image=image)
            serializer = ImageSerializer(
                data={"memory": newImg.memory.id, "image": newImg.image}, many=False)

            if serializer.is_valid():
                serialized_images.append(serializer.data)
            else:
                return Response({"errors": serializer.errors})

        if not memory.preview:
            memory.preview = images[0]
            memory.save()

    return Response({"images": serialized_images})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_image(request, image_id):
    image = Image.objects.get(id=image_id)
    memory = Memory.objects.get(id=image.memory.id)
    image.delete()
    memory_images = Image.objects.filter(memory=memory)

    if (len(memory_images)) > 0:
        image_serializer = ImageSerializer(memory_images[0], many=False)
        memory.preview = image_serializer.data["image"][7:]
    else:
        memory.preview = None

    memory.save()

    return Response({})


@ api_view(["POST"])
@ permission_classes([IsAuthenticated])
def create_memory_space(request):
    serializer = MemorySpaceSerializer(data=request.data, many=False)

    try:
        if serializer.is_valid():
            memory_space = serializer.save()
            memory_space.users.add(request.user)
            memory_space.save()

            return Response({"memory_space": serializer.data}, status=201)
        else:
            return Response({"errors": serializer.errors})
    except:
        return Response({})


@ api_view(["GET"])
@ permission_classes([IsAuthenticated])
def get_memory_spaces(request):
    memory_spaces = MemorySpace.objects.filter(users__id=request.user.id)
    serializer = MemorySpaceSerializer(memory_spaces, many=True)

    return Response({"memory-spaces": serializer.data})


@ api_view(["GET"])
@ permission_classes([IsAuthenticated])
def get_memory_space_details(request, memory_space_id):
    memory_space = None

    try:
        memory_space = MemorySpace.objects.get(id=memory_space_id)
    except:
        return Response({"error": "not found"})

    if request.user not in memory_space.users.all():
        return Response({"error": "unauthorized"})

    memories = Memory.objects.filter(memory_space=memory_space)
    serializer = MemorySpaceDetailsSerializer(memory_space)
    memory_serializer = MemorySerializer(memories, many=True)

    return Response({"memory_space": serializer.data, "memories": memory_serializer.data})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def edit_memory_space(request, memory_space_id):
    memory_space = None

    try:
        memory_space = MemorySpace.objects.get(id=memory_space_id)
    except:
        return Response({"error": "not found"})

    if request.user not in memory_space.users.all():
        return Response({"error": "unauthorized"})

    serializer = MemorySpaceSerializer(
        memory_space, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"memory_space": serializer.data})

    return Response({"errors": serializer.errors})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_memory_space(request, memory_space_id):
    memory_space = None

    try:
        memory_space = MemorySpace.objects.get(id=memory_space_id)
    except:
        return Response({"error": "not found"})

    if request.user not in memory_space.users.all():
        return Response({"error": "unauthorized"})

    memory_space.delete()

    return Response({})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_memory_space(request):
    query = request.query_params.get("query")
    memory_spaces = MemorySpace.objects.filter(
        Q(name=query) | Q(description__icontains=query)).filter(Q(users__id=request.user.id))
    serializer = MemorySpaceSerializer(memory_spaces, many=True)
    return Response({"memory_spaces": serializer.data})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def add_memory_space_members(request, memory_space_id):
    memory_space = None

    try:
        memory_space = MemorySpace.objects.get(id=memory_space_id)
    except:
        return Response({"error": "not found"})

    if request.user not in memory_space.users.all():
        return Response({"error": "unauthorized"})

    for userID in request.data["members"]:
        memory_space.users.add(userID)

    memory_space.save()
    serializer = MemorySpaceSerializer(memory_space)

    return Response({"memory_space": serializer.data})
