from django.db import models

class Publisher(models.Model):
    # Ensure this parameter is named exactly max_length
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Author(models.Model):
    # Ensure these parameters are named exactly max_length
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    short_bionote = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.last_name}, {self.first_name}"

class Publication(models.Model):
    PUBLICATION_TYPES = [
        ('Book', 'Book'),
        ('Journal Article', 'Journal Article'),
        ('Research Paper', 'Research Paper'),
        ('Report', 'Report'),
    ]

    # Ensure these parameters are named exactly max_length
    title = models.CharField(max_length=255)
    publication_type = models.CharField(max_length=50, choices=PUBLICATION_TYPES)
    publication_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField(blank=True, null=True)
    abstract = models.TextField(blank=True, null=True)
    
    # 3NF Foreign Key Constraints
    publisher = models.ForeignKey(Publisher, on_delete=models.RESTRICT, related_name='publications')
    author = models.ForeignKey(Author, on_delete=models.RESTRICT, related_name='publications')

    def __str__(self):
        return self.title