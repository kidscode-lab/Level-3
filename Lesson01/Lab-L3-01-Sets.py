# L3 - Lesson 01
#   Lab 3: Sets
#   Create two sets: one with your favorite colors and another with your friend's favorite colors.
#       Find colors you both like using set operations.
print("=== Exercise 3: Sets ===")
# Create two sets of favorite colors
my_colors = {"blue", "green", "red", "purple"}
friend_colors = {"red", "yellow", "blue", "orange"}

print("My favorite colors:", my_colors)
print("Friend's favorite colors:", friend_colors)

# Find colors we both like (intersection)
common_colors = my_colors & friend_colors  # or my_colors.intersection(friend_colors)
print("Colors we both like:", common_colors)

# Bonus: Other set operations
all_colors = my_colors | friend_colors  # Union (all colors)
only_mine = my_colors - friend_colors   # Colors only I like
only_friends = friend_colors - my_colors # Colors only friend likes

print("All colors combined:", all_colors)
print("Colors only I like:", only_mine)
print("Colors only friend likes:", only_friends)
