from joblib import load
import numpy as np

def predict(input_array):
    input_array = np.array(input_array).reshape(1, -1)
    model = load('decision_tree_model.joblib')
    prediction = model.predict(input_array)[0]
    return prediction

if __name__ == "__main__":
    input = [1, 1, 1, 1, 1] #only a test input for now. We need to find a way to get the results from the front end
    
    result = predict(input)
    print(f"Prediction: {result}")