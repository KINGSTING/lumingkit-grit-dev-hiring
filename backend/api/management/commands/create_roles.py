from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile

class Command(BaseCommand):
    help = 'Creates predefined user roles (admin, editor, author)'

    def handle(self, *args, **options):
        # admin
        admin, created = User.objects.get_or_create(username='admin')
        if created:
            admin.set_password('adminpass')
            admin.email = 'admin@example.com'
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()
            UserProfile.objects.create(user=admin, role='admin')
            self.stdout.write(self.style.SUCCESS('Admin user created'))
        else:
            self.stdout.write('Admin user already exists')

        # editor
        editor, created = User.objects.get_or_create(username='editor')
        if created:
            editor.set_password('editorpass')
            editor.email = 'editor@example.com'
            editor.save()
            UserProfile.objects.create(user=editor, role='editor')
            self.stdout.write(self.style.SUCCESS('Editor user created'))
        else:
            self.stdout.write('Editor user already exists')

        # author
        author, created = User.objects.get_or_create(username='author1')
        if created:
            author.set_password('authorpass')
            author.email = 'author@example.com'
            author.save()
            UserProfile.objects.create(user=author, role='author')
            self.stdout.write(self.style.SUCCESS('Author user created'))
        else:
            self.stdout.write('Author user already exists')