from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from django.core.mail import EmailMessage
from django.conf import settings
import random

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

            try:
                send_email("welcome to never fade", f"Hey {user.username}, welcome to never fade", user.email)
            except:
                pass
            finally:
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


@api_view(["PATCH"])
def get_password_reset_code (request, user_email):
    user = None

    try:
        user = User.objects.get(email = user_email)
    except:
        return Response({ "error": "not found" }, status = 404)

    try:
        reset_code = random.randint(1000, 9999)
        user.reset_code = reset_code

        try:
            send_email("reset your password", f"The code to reset your password is { reset_code }", user_email)
            user.save()
        except:
            return Response({}, status = 400)

        return Response({})
    except:
        return Response({}, status = 400)


@api_view(["PATCH"])
def reset_user_password (request):
    user = None

    try:
        try:
            user = User.objects.get(email = request.data.get("email"))
        except:
            return Response({ "error": "not found" }, status = 404)

        if user.reset_code != int(request.data.get("reset_code")):
            return Response({ "error": "invalid code" }, status = 400)
            
        serializer = UserSerializer(user, data = { "password": request.data.get("new_password") }, partial = True)
        
        if serializer.is_valid():
            user.password = make_password(request.data.get("new_password"))
            user.reset_code = None
            user.save()

            return Response({})
        
        return Response({ "errors": serializer.errors }, status = 400)
    except:
        return Response({}, status = 400)


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

        images_to_serialize = []

        if images:
            for image in images:
                images_to_serialize.append({ "image": image, "memory": memory.id })

            image_serializer = ImageSerializer(data = images_to_serialize[:14], many = True)

            if image_serializer.is_valid():
                image_serializer.save()
                memory.preview = image_serializer.data[0]["image"][60:]
            else:
                memory.delete()
                return Response({"errors": image_serializer.errors})

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
        if request.user not in memory.memory_space.users.all() and request.user not in list(memory.shared_with.all()):
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
    replace = request.query_params["replace"]

    # if memory.owner.id != request.user.id:
    #     return Response({"error": "unauthorized"})

    try:

        if replace == "true":
            memory.shared_with.set(request.data["shared_with"])
        else:
            for userID in userIDs:
                memory.shared_with.add(userID)

        if len(list(memory.shared_with.all())):
            memory.shared =  True
        else:
            memory.shared = False

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
        Q(title__icontains=query) | Q(description__icontains=query) | Q(date__icontains=query) | Q(category__icontains=query)).filter(Q(owner=request.user) | Q(memory_space__users__id=request.user.id)).distinct()
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
    images_to_serialize = []
    serialized_images = []

    if images:
        for image in images:
            images_to_serialize.append({ "image": image, "memory": memory.id })

        serializer = ImageSerializer(data = images_to_serialize[:14], many = True)

        if serializer.is_valid():
            serializer.save()

            if not memory.preview:
                memory.preview = serializer.data[0]["image"][60:]
                memory.save()
                print(memory)
            serialized_images = serializer.data
        else:
            return Response({"errors": serializer.errors})


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
        memory.preview = image_serializer.data["image"][60:]
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
            memory_space.created_by = request.user
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
    replace = request.query_params["replace"]

    try:
        memory_space = MemorySpace.objects.get(id=memory_space_id)
    except:
        return Response({"error": "not found"})

    if request.user not in memory_space.users.all():
        return Response({"error": "unauthorized"})

    if replace == "true":
        memory_space.users.set(request.data["members"])
    else:
        for userID in request.data["members"]:
            memory_space.users.add(userID)

    memory_space.save()
    serializer = MemorySpaceDetailsSerializer(memory_space)

    return Response({"memory_space": serializer.data})

def send_email (subject, body, recepient):
    email = EmailMessage(
                subject,
                body,
                settings.EMAIL_HOST_USER,
                [recepient]
            )
    email.fail_silently = False
    email.send()
