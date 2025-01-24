from django.http import JsonResponse
from .models import Order, Menu


def get_menu(request):
    menu_items = Menu.objects.all()
    if not menu_items:
        return JsonResponse({"error": "No menu items found"}, status=404)
    data = [{"name": item.name, "price": item.price} for item in menu_items]
    return JsonResponse(data, safe=False)

def place_order(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        menu_id = request.POST.get('menu_id')
        quantity = request.POST.get('quantity')
        menu_item = Menu.objects.get(id=menu_id)
        order = Order.objects.create(user_id=user_id, menu_item=menu_item, quantity=quantity, status='Processing')
        return JsonResponse({'order_id': order.id, 'status': order.status})
