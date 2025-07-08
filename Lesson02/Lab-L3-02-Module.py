# L3 - Lesson 02
<<<<<<< HEAD
#   Check out program - modual design
=======
#   Modular Checkout System
#   Each function has ONE job and does it well!
>>>>>>> 18ce4e5e6912d6f5ea72e9efd153901ec8745393

import random

def scan_items():
<<<<<<< HEAD
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
=======
    """
    Job: Scan items and build a list
    Input: Nothing (gets input from user)
    Output: List of items with names and prices
    """
    items = []

    while True:
        item_name = input("Enter item name: ")
        if item_name.strip() != "":
            # Generate random price for the item
            item_price = round(random.uniform(0.50, 10.00), 2)
            items.append({"name": item_name, "price": item_price})
            print(f"Item: {item_name} @ ${item_price:.2f}")
        else:
            # Exit when user presses Enter without typing
            break

    return items

def calculate_total(items):
    """
    Job: Add up all item prices
    Input: List of items
    Output: Total cost as a number
    """
>>>>>>> 18ce4e5e6912d6f5ea72e9efd153901ec8745393
    total = 0
    for item in items:
        total += item["price"]
    return total

<<<<<<< HEAD
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
=======
def get_payment_method():
    """
    Job: Get a valid payment method from user
    Input: Nothing (gets input from user)
    Output: Valid payment method ("cash" or "card")
    """
    payment_method = input("Payment method (cash/card): ")

    if payment_method not in ["cash", "card"]:
        print("Error: Invalid payment method!")
        return None

    return payment_method

def process_payment(total):
    """
    Job: Handle the payment process
    Input: Total amount needed
    Output: True if payment successful, False if not
    """
    # Get payment method
    payment_method = get_payment_method()

    if payment_method is None:
        return False

    # Get payment amount
    amount_paid = float(input("Enter payment amount: "))
    # Check if payment is sufficient
    if amount_paid >= total:
        change = amount_paid - total
        print(f"Payment successful by {payment_method}! Change: ${change:.2f}")
        return True
    else:
        print("Error: Insufficient payment!")
        return False

def print_receipt(items, total):
    """
    Job: Print a receipt showing all items and total
    Input: List of items and total amount
    Output: Nothing (just prints to screen)
    """
    print("Receipt:")
    for item in items:
        print(f"{item['name']}: ${item['price']:.2f}")

    print(f"Total: ${total:.2f}")

def main():
    """
    Job: Coordinate all the other functions (like a manager)
    This is the main program that runs everything in order
    """
    print("Welcome to Checkout System =====")

    # Step 1: Scan items
    items = scan_items()

    # Step 2: Only continue if we have items
    if len(items) > 0:
        # Step 3: Calculate total
        total = calculate_total(items)
        print(f"\nTotal: ${total:.2f}")

        # Step 4: Process payment
        payment_successful = process_payment(total)

        # Step 5: Print receipt if payment was successful
        if payment_successful:
            print_receipt(items, total)
            print("Checkout complete!")
    else:
        print("No items scanned. Goodbye!")

# Run the program
if __name__ == "__main__":
    main()
>>>>>>> 18ce4e5e6912d6f5ea72e9efd153901ec8745393
