from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublisherViewSet, AuthorViewSet, PublicationViewSet, cloudinary_upload_view

# Initialize the automated Django REST Framework router matrix
router = DefaultRouter()
router.register(r'publishers', PublisherViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'publications', PublicationViewSet)

# Global routing array configuration mapping base entries and utility endpoints
urlpatterns = [
    # Automated REST ViewSet endpoint routing tree
    path('', include(router.urls)),
    
    # Standalone functional API upload route handled independently
    # Note: Trailing slash explicitly declared to ensure pre-flight OPTIONS requests pass CORS validation
    path('upload/', cloudinary_upload_view, name='cloudinary-upload'),
]