import csv
import random

filename = "survey_test_data.csv"

headers = [
    "Time",
    "Comfortable",
    "Staff",
    "Compensation",
    "Satisfaction",
    "Returned"
]

data = []

def generate_data(num_rows):
    for _ in range(num_rows):
        row = [random.choice([0, 1]) for _ in range(5)]

        row.append(1 if row.count(1) >= 3 else 0)
        if random.random() < 0.1:
            row[-1] = 1 if row[-1] == 0 else 0

        data.append(row)
    return data

with open(filename, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(headers)
    generate_data(1000)
    writer.writerows(data)

