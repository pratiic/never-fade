from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.functions import Length
from django.db.models import CharField
from django.db.models.query_utils import Q
from PIL import Image as ImagePillow
from django.db.models.signals import post_save

CharField.register_lookup(Length, "length")

# Create your models here.


class User (AbstractUser):
    username = models.CharField(max_length=25)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(blank=True, null=True)
    password = models.CharField(max_length=100)
    reset_code = models.IntegerField(blank = True, null = True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username


class Memory (models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    # image = models.ImageField(null=True, blank=True)
    preview = models.ImageField(blank=True, null=True)
    category = models.CharField(max_length = 100, blank = True, null = True)
    date = models.CharField(max_length = 100, blank = True, null = True)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True)
    shared_with = models.ManyToManyField(
        User, blank=True, null=True, related_name="shared")
    shared = models.BooleanField(default=False)
    memory_space = models.ForeignKey(
        "MemorySpace", blank=True, null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Image (models.Model):
    memory = models.ForeignKey(Memory, on_delete=models.CASCADE)
    image = models.ImageField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add = True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return ""


class MemorySpace (models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True)
    users = models.ManyToManyField(
        User, blank=True, null=True, related_name="users")
    created_by = models.ForeignKey(User, blank = True, null = True, on_delete = models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

# def compress_image (sender, **kwargs):
#     if kwargs["created"]:
#         with ImagePillow.open(kwargs["instance"].image.path) as image:
#             image.save(kwargs["instance"].image.path, optimize = True, quality = 50)

# post_save.connect(compress_image, sender = Image)