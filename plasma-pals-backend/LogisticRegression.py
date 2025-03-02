from pandas import read_csv
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn import metrics
from joblib import dump, load
import os

file_name = "transfusion.data"
seed = None  # or set a specific seed for reproducibility

df = read_csv(file_name, header=0)
X = df.iloc[:, :-1].values
y = df.iloc[:, -1].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=seed)

# Instantiate Logistic Regression
clf = LogisticRegression(random_state=seed, max_iter=100000)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
accuracy_new = metrics.accuracy_score(y_test, y_pred)

loaded_model = None
accuracy_old = 0
model_filename = 'logistic_model.joblib'
if os.path.exists(model_filename):
    try:
        loaded_model = load(model_filename)
        old_y_pred = loaded_model.predict(X_test)
        accuracy_old = metrics.accuracy_score(y_test, old_y_pred)
    except FileNotFoundError:
        loaded_model = None

if loaded_model is None or accuracy_new > accuracy_old:
    print("New model is better. Saving the new model. Old accuracy:", accuracy_old, "New accuracy:", accuracy_new)
    dump(clf, model_filename)
else:
    print("Keeping old model. Old accuracy:", accuracy_old, "New accuracy:", accuracy_new)
    clf = loaded_model

# Logistic Regression doesn't have a tree structure to export,
# but you can print coefficients to understand feature impacts:
print("Model coefficients:", clf.coef_)
print("Intercept:", clf.intercept_)
