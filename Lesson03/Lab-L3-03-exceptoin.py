# L3 - Lesson 03
#   Unsafe Calculator

def unsafe_calculator():
    """
    This calculator will CRASH with invalid input!
    Your job: Add try-except blocks to handle errors gracefully.
    """
    print("=== Simple Calculator ===")
    print("This calculator needs your help to handle errors!")
    print()
    
    # TODO: Add try-except here to handle ValueError
    first_number = float(input("Enter first number: "))
    
    # TODO: Add try-except here to handle ValueError
    second_number = float(input("Enter second number: "))
    
    # Get operation from user
    operation = input("Choose operation (+, -, *, /): ")
    
    # TODO: Add try-except here to handle different errors
    if operation == "+":
        result = first_number + second_number
    elif operation == "-":
        result = first_number - second_number
    elif operation == "*":
        result = first_number * second_number
    elif operation == "/":
        result = first_number / second_number  # This can cause ZeroDivisionError!
    else:
        print("Invalid operation!")
        return
    
    print(f"Result: {first_number} {operation} {second_number} = {result}")

# Test the unsafe calculator (it will crash!)
if __name__ == "__main__":
    unsafe_calculator()