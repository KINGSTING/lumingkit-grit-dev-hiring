from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from auditlog.models import LogEntry

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    """Log each successful login to auditlog."""
    LogEntry.objects.create(
        content_type=None,
        object_pk=None,
        object_repr=f"User {user.username} logged in",
        action=LogEntry.Action.CREATE,   # reuse CREATE or add a custom action
        changes='Login',
        actor=user,
        additional_data={'ip': request.META.get('REMOTE_ADDR', 'unknown')}
    )