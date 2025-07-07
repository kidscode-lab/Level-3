# L3 - Lesson 03
#   Safe Calculator

def safe_calculator_solution():
    """
    COMPLETE SOLUTION - This is what students should aim for
    """
    print("=== Safe Calculator (Solution) ===")
    
    # Get first number with error handling
    while True:
        try:
            first_number = float(input("Enter first number: "))
            break  # Exit loop if successful
        except ValueError:
            print("Error: Please enter a valid number!")
    
    # Get second number with error handling
    while True:
        try:
            second_number = float(input("Enter second number: "))
            break  # Exit loop if successful
        except ValueError:
            print("Error: Please enter a valid number!")
    
    # Get operation from user
    operation = input("Choose operation (+, -, *, /): ")
    
    # Perform calculation with error handling
    try:
        if operation == "+":
            result = first_number + second_number
        elif operation == "-":
            result = first_number - second_number
        elif operation == "*":
            result = first_number * second_number
        elif operation == "/":
            if second_number == 0:
                raise ZeroDivisionError("Cannot divide by zero!")
            result = first_number / second_number
        else:
            print("Error: Invalid operation! Please use +, -, *, or /")
            return
        
        print(f"Result: {first_number} {operation} {second_number} = {result}")
        
    except ZeroDivisionError as e:
        print(f"Math Error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")