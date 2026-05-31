from rest_framework import viewsets, status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
import cloudinary.uploader
import traceback

from .models import Publisher, Author, Publication
from .serializers import PublisherSerializer, AuthorSerializer, PublicationSerializer
from .permissions import IsAdminOrReadOnly

class PublicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrReadOnly]
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    lookup_field = 'doi'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['publication_type', 'publisher__name']
    search_fields = [
        'title', 
        'doi', 
        'abstract', 
        'description',
        'authors__first_name',   # search in author first names
        'authors__last_name',     # search in author last names
        'publisher__name'         # search in publisher names
    ]
    ordering_fields = ['publication_date', 'price', 'title']
    ordering = ['-publication_date']

class AuthorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrReadOnly]
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'short_bionote']
    ordering_fields = ['last_name', 'first_name']

class PublisherViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminOrReadOnly]
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    
# ==============================================================
# CUSTOM UTILITY ENDPOINTS LAYER
# ==============================================================

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def cloudinary_upload_view(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file element detected'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        file_to_upload = request.FILES['file']
        upload_target = request.data.get('target', 'general')
        folder_path = f"grithub_archive/{upload_target}s"
        
        # This uses the configuration loaded in settings.py
        upload_result = cloudinary.uploader.upload(
            file_to_upload,
            folder=folder_path,
            overwrite=True,
            resource_type="auto"
        )
        
        return Response({
            'secure_url': upload_result.get('secure_url'),
            'public_id': upload_result.get('public_id')
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        # This will print the full error in your terminal docker logs
        traceback.print_exc()
        return Response(
            {'error': f"Cloudinary transmission failure: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )