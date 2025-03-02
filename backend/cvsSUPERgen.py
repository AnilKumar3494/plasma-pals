import csv
import random

filename = "plasma_donor_survey.csv"

headers = [
    "Age", "Gender", "Weight", "First_Time_Donor", "Health_Issues", "Compensation",
    "Time_Wait", "Comfortable", "Staff", "Satisfaction", "Distance_to_Center",
    "Frequency_Last_Year", "Returned"
]

def generate_row():
    age = random.randint(18, 70)
    gender = random.choice([0, 1])  # 0 = Male, 1 = Female
    weight = random.uniform(50, 120)
    first_time = random.choice([0, 1])
    health_issues = random.choices([0, 1], weights=[0.8, 0.2])[0]  # 20% chance of health issues
    compensation = random.choice([0, 1])
    time_wait = random.randint(5, 60)  # Wait time between 5 and 60 mins
    comfortable = random.choice([0, 1])
    staff = random.choice([0, 1])
    satisfaction = 1 if (comfortable + staff + compensation) >= 2 else 0
    distance = round(random.uniform(0.5, 50), 2)  # Distance in km
    frequency_last_year = random.randint(0, 10) if first_time == 0 else 0

    # Retention Probability Logic
    retention_prob = 0.3  # Base probability
    retention_prob += 0.2 if satisfaction == 1 else -0.2
    retention_prob += 0.1 if frequency_last_year >= 3 else 0
    retention_prob += 0.1 if compensation == 1 else -0.1
    retention_prob -= 0.1 if distance > 20 else 0

    returned = 1 if random.random() < retention_prob else 0

    # Add noise
    if random.random() < 0.05:
        returned = 1 - returned

    return [age, gender, round(weight, 1), first_time, health_issues, compensation,
            time_wait, comfortable, staff, satisfaction, distance, frequency_last_year, returned]

def generate_data(num_rows):
    data = []
    for _ in range(num_rows):
        data.append(generate_row())
    return data

# Write CSV
with open(filename, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(headers)
    dataset = generate_data(100000)
    writer.writerows(dataset)

print(f"Generated {len(dataset)} plasma donor survey entries.")
