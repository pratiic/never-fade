from django.contrib import admin

from .models import User, Memory, MemorySpace

# Register your models here.

admin.site.register(User)
admin.site.register(Memory)
admin.site.register(MemorySpace)
