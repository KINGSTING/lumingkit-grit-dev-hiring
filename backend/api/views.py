from rest_framework import viewsets, status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
import cloudinary.uploader
import traceback

from .models import Publisher, Author, Publication
from .serializers import PublisherSerializer, AuthorSerializer, PublicationSerializer

# ==============================================================
# STANDARD CRUD VIEWSETS LAYER
# ==============================================================

class PublisherViewSet(viewsets.ModelViewSet):
    # FIXED: Removed the invalid 'a' argument
    queryset = Publisher.objects.all() 
    serializer_class = PublisherSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
    lookup_field = 'doi'  # Use DOI for lookups instead of the default 'id'

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
            resource_type="image"
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