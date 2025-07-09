import json

school_json = '''
{
    "school_name": "KidsCode Academy",
    "students": [
        {"name": "John", "age": 13, "grade": 8},
        {"name": "Alice", "age": 14, "grade": 9},
        {"name": "Bob", "age": 12, "grade": 7}
    ],
    "teachers": [
        {"name": "Mr. Smith", "subject": "Math", "years_experience": 5},
        {"name": "Ms. Johnson", "subject": "Science", "years_experience": 8}
    ],
    "courses": {
        "programming": ["Python", "JavaScript", "HTML"],
        "mathematics": ["Algebra", "Geometry"],
        "science": ["Physics", "Chemistry", "Biology"]
    }
}
'''

school_data = json.loads(school_json)

# Iterate through students
print("STUDENTS:")
for student in school_data["students"]:
    print(f"- {student['name']}, Age: {student['age']}, Grade: {student['grade']}")

print("\nTEACHERS:")
for teacher in school_data["teachers"]:
    print(f"- {teacher['name']} teaches {teacher['subject']} ({teacher['years_experience']} years exp.)")

print("\nCOURSES:")
for category, course_list in school_data["courses"].items():
    print(f"- {category.title()}: {', '.join(course_list)}")

print("\n" + "="*60 + "\n")
