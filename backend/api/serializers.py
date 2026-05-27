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
    # --- WRITING / INCOMING PAYLOADS ---
    # FIX: Changed from 'author' to 'authors' with many=True to handle lists of IDs [1, 2, ...]
    authors = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(), 
        many=True
    )
    publisher = serializers.PrimaryKeyRelatedField(
        queryset=Publisher.objects.all()
    )
    
    # --- READING / FRONTEND VISUALS ---
    # FIX: Set source='authors' to parse the structural relation correctly
    author_details = AuthorSerializer(source='authors', many=True, read_only=True)
    publisher_details = PublisherSerializer(source='publisher', read_only=True)

    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'publication_type', 'publication_date', 
            'price', 'description', 'abstract', 
            'authors', 'publisher',               # Read/Write IDs (Array for authors)
            'author_details', 'publisher_details' # Rich UI Rendering Content Objects
        ]