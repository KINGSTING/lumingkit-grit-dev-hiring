# serializers.py
from rest_framework import serializers
from .models import Publisher, Author, Publication

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        # FIX: Include 'image_url' in the serialization pipeline
        fields = ['id', 'name', 'image_url']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        # FIX: Include 'image_url' in the serialization pipeline
        fields = ['id', 'first_name', 'last_name', 'short_bionote', 'image_url']


class PublicationSerializer(serializers.ModelSerializer):
    authors = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(), 
        many=True
    )
    publisher = serializers.PrimaryKeyRelatedField(
        queryset=Publisher.objects.all()
    )
    
    author_details = AuthorSerializer(source='authors', many=True, read_only=True)
    publisher_details = PublisherSerializer(source='publisher', read_only=True)

    class Meta:
        model = Publication
        fields = [
            'id', 'title', 'publication_type', 'publication_date', 
            'price', 'description', 'abstract', 
            'authors', 'publisher',               
            'author_details', 'publisher_details' 
        ]