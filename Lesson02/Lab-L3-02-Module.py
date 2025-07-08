# L3 - Lesson 02
#   Check out program - modual design

import random

def scan_items():
    items = []
    print("Welcome to Checkout System =====")

    # Scan Items
    while True:
        item_name = input("Enter item name: ")
        if item_name.strip() != "":
            # Find the price and add item to list
            item_price = round(random.uniform(0.50, 10.00), 2)
            items.append({"name": item_name, "price": item_price})
            print(f"Item: ${item_name} @ ${item_price:.2f}")
        else:
            # Exit while loop for just hitting Enter key
            break
    
    return items

def calculate_total(items):
    total = 0
    for item in items:
        total += item["price"]
    return total

def process_payment(total):
    payment_method = input("Payment method (cash/card): ")
    if payment_method not in ["cash", "card"]:
        print("Error: Invalid payment method!")
        return False
    else:
        # Process Payment
        amount_paid = float(input("Enter payment amount: "))
        # Is payment sufficient?
        if amount_paid >= total:
            print(f"Payment successful by {payment_method}! Change: ${amount_paid - total:.2f}")
            return True
        else:
            print('Insufficient payment made')
            return False
    
def print_receipt(items, total):
    print("Receipt:")
    for item in items:
        print(f"{item['name']}: ${item['price']:.2f}")
    print(f"Total: ${total:.2f}")
    print("Checkout complete!")

def main():
    items = scan_items()
    total = calculate_total(items)
    if(process_payment(total)):
        print_receipt(items, total)
    
    print("Goodbye")


main()