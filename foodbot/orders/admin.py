from django.contrib import admin
from .models import Menu, Order

class MenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'description')  # Fields to display in the list view
    search_fields = ('name', 'description')  # Fields to search by
    list_filter = ('price',)  # Add filters in the sidebar for the 'price' field
    ordering = ('name',)  # Default ordering by name

class OrderAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'menu_item', 'quantity', 'status', 'order_date')  # Fields to display in the list view
    search_fields = ('user_id', 'menu_item__name', 'status')  # Fields to search by
    list_filter = ('status', 'order_date')  # Add filters in the sidebar for 'status' and 'order_date'
    ordering = ('-order_date',)  # Default ordering by order_date (newest first)

# Register models with the admin site
admin.site.register(Menu, MenuAdmin)
admin.site.register(Order, OrderAdmin)
