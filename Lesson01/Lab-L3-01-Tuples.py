# L3 - Lesson 01
#   Lab 2: Tuples
#   Create a tuple with your birth year, month, and day.
#       Try to access each element and print them in a sentence like "I was born in [year]".
print("=== Exercise 2: Tuples ===")
# Create a tuple with birth year, month, and day
birth_date = (2010, 8, 15)  # August 15, 2010
print("Birth date tuple:", birth_date)
# Access each element and print in a sentence
year = birth_date[0]
month = birth_date[1]
day = birth_date[2]
print(f"I was born in {year}")
print(f"My birth month is {month}")
print(f"My birth day is {day}")
print(f"Full sentence: I was born on {month}/{day}/{year}")
