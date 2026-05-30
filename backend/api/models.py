from django.db import models

class Author(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    short_bionote = models.TextField(blank=True, null=True)
    # Cloudinary portrait location asset anchor
    image_url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'API_AUTHOR'

    def __str__(self):
        return f"{self.last_name}, {self.first_name}"


class Publisher(models.Model):
    name = models.CharField(max_length=255, unique=True)
    # Cloudinary cover / press logo location asset anchor
    image_url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'API_PUBLISHER'

    def __str__(self):
        return self.name


class Publication(models.Model):
    PUBLICATION_TYPES = [
        ('Book', 'Book'),
        ('Journal Article', 'Journal Article'),
        ('Research Paper', 'Research Paper'),
        ('Report', 'Report'),
    ]

    title = models.CharField(max_length=255)
    publication_type = models.CharField(max_length=50, choices=PUBLICATION_TYPES)
    publication_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField(blank=True, null=True)
    abstract = models.TextField(blank=True, null=True)
    
    # 3NF Constraints & Many-To-Many Junction Initializations
    # Note: No image_url column is added here, as it cleanly inherits graphics from the Publisher relation
    publisher = models.ForeignKey(Publisher, on_delete=models.RESTRICT, related_name='publications')
    authors = models.ManyToManyField(Author, related_name='publications')

    class Meta:
        db_table = 'API_PUBLICATION'

    def __str__(self):
        return self.title