from rest_framework import serializers
from .models import Publisher, Author, Publication

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = '__all__'

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class PublicationSerializer(serializers.ModelSerializer):
    # These read-only fields provide full relational data (names) to your React tables
    author_details = AuthorSerializer(source='author', read_only=True)
    publisher_details = PublisherSerializer(source='publisher', read_only=True)

    class Meta:
        model = Publication
        fields = '__all__'