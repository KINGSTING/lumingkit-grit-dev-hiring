from rest_framework import serializers
from .models import Publisher, Author, Publication

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ['id', 'name']

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'first_name', 'last_name', 'short_bionote']

class PublicationSerializer(serializers.ModelSerializer):
    # 1. Primary key fields used for incoming POST / PUT payloads
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())
    publisher = serializers.PrimaryKeyRelatedField(queryset=Publisher.objects.all())
    
    # 2. Rich object representations matched with frontend requirements
    author_details = AuthorSerializer(source='author', read_only=True)
    publisher_details = PublisherSerializer(source='publisher', read_only=True)

    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'publication_type', 'publication_date', 
            'price', 'description', 'abstract', 
            'author', 'publisher',            # Read/Write IDs
            'author_details', 'publisher_details' # Frontend Display Objects
        ]