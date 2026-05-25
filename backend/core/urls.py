from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.閲覧),
    path('api/', include('api.urls')),
]