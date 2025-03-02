import sys
from joblib import load
import numpy as np
from pymongo import MongoClient

def predict(input_array):
    input_array = np.array(input_array).reshape(1, -1)
    model = load('decision_tree_model.joblib')
    prediction = model.predict(input_array)[0]
    return prediction

if __name__ == "__main__":

    client = MongoClient("mongodb+srv://demoUser:demoUserPass@plasma-pals-survey-clus.8sf94.mongodb.net/?retryWrites=true&w=majority&appName=plasma-pals-survey-cluster")  # Change if needed
    db = client["test"]  # Change this to your database name
    collection = db["predictionDB"]  # Change this to your collection name

    email = sys.argv[1]

    input = [sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6]] #only a test input for now. We need to find a way to get the results from the front end
    result = predict(input)

    update_result = collection.update_one({"email": email,},{"$set": {"prediction": int(result)}}
    )

    if update_result.matched_count > 0:
        print(f"Updated prediction for {email}: {result}")
    else:
        print(f"ERROR: No email: {email}")

    print(f"Prediction of AI: {result}")