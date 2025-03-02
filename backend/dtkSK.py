from pandas import read_csv
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import export_graphviz
from sklearn import metrics
from joblib import dump, load
import graphviz
import pandas as pd

file_name = "survey_test_data.csv"
max_depth = 100
df = read_csv(file_name, header=0)
X = df.iloc[:, :-1].values
y = df.iloc[:, -1].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=1)

clf = DecisionTreeClassifier(criterion="entropy", max_depth=max_depth)

clf = clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
accuracy_new = metrics.accuracy_score(y_test, y_pred)

loaded_model = None
accuracy_old = 0
try:
    loaded_model = load('decision_tree_model.joblib')
except FileNotFoundError:
    loaded_model = None
if loaded_model is not None:
    old_y_pred = loaded_model.predict(X_test)
    accuracy_old = metrics.accuracy_score(y_test, old_y_pred)

if accuracy_new > accuracy_old:
    print("New model is better than the old one. Saving the new model. Old accuracy: ", accuracy_old, "New accuracy: ", accuracy_new)
    dump(clf, 'decision_tree_model.joblib')
else:
    print("Keeping old model. Old accuracy: ", accuracy_old, "New accuracy: ", accuracy_new)
    clf = loaded_model

y_proba = clf.predict_proba(X_test)[:, 1]
auc_score = metrics.roc_auc_score(y_test, y_proba)
print("ROC AUC Score:", auc_score)

# 2. Precision, Recall, F1 Score
precision, recall, f1, _ = metrics.precision_recall_fscore_support(y_test, y_pred, average='binary')
print("Precision:", precision, "Recall:", recall, "F1 Score:", f1)

# 3. Lift Calculation:
# For a simple lift, we compare the average actual positive rate in the top decile
data = pd.DataFrame({"y": y_test, "y_proba": y_proba})
data.sort_values("y_proba", ascending=False, inplace=True)
top_decile = data.head(int(0.1 * len(data)))
overall_rate = data["y"].mean()
top_decile_rate = top_decile["y"].mean()
lift = top_decile_rate / overall_rate if overall_rate != 0 else float('inf')
print("Lift (Top Decile vs Overall):", lift)

# pdf

dot_data = export_graphviz(clf, out_file=None, 
                           feature_names=df.columns[:-1],  
                           class_names=['No', 'Yes'],  
                           filled=True, rounded=True,  
                           special_characters=True)  

graph = graphviz.Source(dot_data)  
graph.render("survey-results")
graph.view() 
