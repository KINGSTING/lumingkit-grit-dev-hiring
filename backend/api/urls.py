from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublisherViewSet, AuthorViewSet, PublicationViewSet

# Initialize the automated DRF REST router matrix
router = DefaultRouter()
router.register(r'publishers', PublisherViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'publications', PublicationViewSet)

# This list variable name MUST be exactly "urlpatterns" (all lowercase)
urlpatterns = [
    path('', include(router.urls)),
]