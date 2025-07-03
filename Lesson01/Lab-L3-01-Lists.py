# L3 - Lesson 01
#   Lab 1: Lists
#   Create a list of your 5 favorite movies.
#       Add a new movie to the end, then change the 2nd movie to a different one.
#       Print the final list.

print("=== Exercise 1: Lists ===")
movies = ["Spider-Man", "Frozen", "Avengers", "Toy Story", "Lion King"]
print("Original movies:", movies)

# Add a new movie to the end
movies.append("Finding Nemo")
print("After adding movie:", movies)

# Change the 2nd movie (index 1) to a different one
movies[1] = "Moana"
print("After changing 2nd movie:", movies)
