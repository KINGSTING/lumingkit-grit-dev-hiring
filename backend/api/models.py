from django.db import models

class Author(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    short_bionote = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.last_name}, {self.first_name}"


class Publisher(models.Model):
    name = models.CharField(max_length=255, unique=True)

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
    # Re-added choices matrix to ensure clean validation states in admin panel/forms
    publication_type = models.CharField(max_length=50, choices=PUBLICATION_TYPES)
    publication_date = models.DateField()
    
    # FIX: Changed from max_length=10 to max_digits=10, added default parameter
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    description = models.TextField(blank=True, null=True)
    abstract = models.TextField(blank=True, null=True)
    
    # 3NF Constraints & Many-To-Many Junction Initialization
    publisher = models.ForeignKey(Publisher, on_delete=models.RESTRICT, related_name='publications')
    authors = models.ManyToManyField(Author, related_name='publications')

    def __str__(self):
        return self.title