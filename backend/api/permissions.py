from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """Full access only for admin users. Others (including public) can only read."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and getattr(request.user.profile, 'role', 'public') == 'admin'

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # This assumes the Author model has a `user` field (OneToOne with User)
        # If not, adjust accordingly or remove this permission.
        return hasattr(obj, 'user') and obj.user == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        return request.user.profile.role == 'admin'