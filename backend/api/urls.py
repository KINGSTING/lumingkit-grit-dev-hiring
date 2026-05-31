from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublisherViewSet, AuthorViewSet, PublicationViewSet, cloudinary_upload_view
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import CustomTokenObtainPairView   # <-- import the custom view

router = DefaultRouter()
router.register(r'publishers', PublisherViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'publications', PublicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload/', cloudinary_upload_view, name='cloudinary-upload'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),   # <-- use custom view
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]