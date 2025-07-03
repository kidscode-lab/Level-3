# L3 - Lesson 01
#   Lab 4: Dictionaries
#   Create a dictionary about your pet (or dream pet) with keys:
#       name, type, age, and favorite_food. Add a new key "tricks" with a list of tricks.
print("=== Exercise 4: Dictionaries ===")
# Create a dictionary about a pet
pet = {
    "name": "Buddy",
    "type": "dog",
    "age": 3,
    "favorite_food": "chicken"
}

print("Original pet info:", pet)

# Add a new key "tricks" with a list of tricks
pet["tricks"] = ["sit", "stay", "roll over", "fetch"]
print("After adding tricks:", pet)

# Access individual information
print(f"My pet's name is {pet['name']}")
print(f"{pet['name']} is a {pet['age']} year old {pet['type']}")
print(f"Favorite food: {pet['favorite_food']}")
print(f"Tricks: {pet['tricks']}")
