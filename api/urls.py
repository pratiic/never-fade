from django.urls import path

from .views import get_memories, get_shared_memories, create_memory, edit_memory, search_memory, get_memory_details, MyTokenObtainPairView, get_user_profile, register, search_user, update_user, share_memory, delete_memory, delete_image, add_images, create_memory_space, get_memory_spaces, get_memory_space_details, edit_memory_space, delete_memory_space, search_memory_space, add_memory_space_members, change_user_password, get_password_reset_code, reset_user_password

urlpatterns = [
    path("users/login/", MyTokenObtainPairView.as_view(),
         name="token-obtain-pair-view"),
    path("users/register/", register, name="register"),
    path("users/profile/", get_user_profile, name="get-user-profile"),
    path("users/search/", search_user, name="search-user"),
    path("users/update/<int:user_id>/", update_user, name="update-user"),
    path("users/change-password/<int:user_id>/",
         change_user_password, name="change-user-password"),
     path("users/get-reset-code/<str:user_email>/", get_password_reset_code, name = "get-reset-code"),
     path("users/reset-password/", reset_user_password, name = "reset-user-password"),
    path("memories/", get_memories, name="get-memories"),
    path("memories/<int:memory_id>/",
         get_memory_details, name="get-memory-details"),
    path("memories/shared/", get_shared_memories, name="get-shared-memories"),
    path("memories/create/", create_memory, name="create-memory"),
    path("memories/edit/<str:memory_id>/", edit_memory, name="edit-memory"),
    path("memories/share/<int:memory_id>/", share_memory, name="share-memory"),
    path("memories/delete/<int:memory_id>/",
         delete_memory, name="delete-memory"),
    path("memories/search/", search_memory, name="search-memory"),
    path("images/<int:memory_id>/", add_images, name="add-images"),
    path("images/delete/<int:image_id>/", delete_image, name="delete-image"),
    path("memory-spaces/create/", create_memory_space, name="create-memory-space"),
    path("memory-spaces/", get_memory_spaces, name="get-memory-spaces"),
    path("memory-spaces/<int:memory_space_id>/",
         get_memory_space_details, name="get-memory-space-details"),
    path("memory-spaces/edit/<int:memory_space_id>/",
         edit_memory_space, name="edit-memory-space"),
    path("memory-spaces/delete/<int:memory_space_id>/",
         delete_memory_space, name="delete-memory-space"),
    path("memory-spaces/search/", search_memory_space, name="search-memory-space"),
    path("memory-spaces/add-members/<int:memory_space_id>/",
         add_memory_space_members, name="add-memory-space-members")
]
