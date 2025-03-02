import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn import metrics
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader

# Set random seed for reproducibility
seed = 900
np.random.seed(seed)
torch.manual_seed(seed)

# Load dataset (assumes the first row contains the header)
file_name = "transfusion.data"
df = pd.read_csv(file_name, header=0)  # First row used as header

# Verify the columns, expected: ['Recency', 'Frequency', 'Monetary', 'Time', 'Donated']
print("Columns in dataset:", df.columns.tolist())

# Separate features and target (assumes target is the last column)
X = df.iloc[:, :-1].values
y = df.iloc[:, -1].values

# Split the data into training and testing sets (e.g., 70/30 split)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=seed)

# Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Convert numpy arrays to PyTorch tensors
X_train_tensor = torch.tensor(X_train_scaled, dtype=torch.float32)
y_train_tensor = torch.tensor(y_train, dtype=torch.float32).unsqueeze(1)
X_test_tensor = torch.tensor(X_test_scaled, dtype=torch.float32)
y_test_tensor = torch.tensor(y_test, dtype=torch.float32).unsqueeze(1)

# Create TensorDataset and DataLoader
batch_size = 16
train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
test_dataset = TensorDataset(X_test_tensor, y_test_tensor)
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

# Define the neural network model using PyTorch
class TransfusionNet(nn.Module):
    def __init__(self, input_dim):
        super(TransfusionNet, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.3),
            
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.Dropout(0.2),
            
            nn.Linear(32, 16),
            nn.BatchNorm1d(16),
            nn.ReLU(),
            nn.Dropout(0.2),
            
            nn.Linear(16, 1),
            nn.Sigmoid()  # For binary classification
        )
        
    def forward(self, x):
        return self.net(x)

input_dim = X_train_tensor.shape[1]  # Automatically determined from data
model = TransfusionNet(input_dim)

# Move model to device (GPU if available)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Define loss function and optimizer
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Early stopping parameters
patience = 10
best_val_loss = np.inf
epochs_without_improvement = 0
num_epochs = 100

# Training loop with early stopping based on validation loss
for epoch in range(num_epochs):
    model.train()
    train_loss = 0.0
    for batch_X, batch_y in train_loader:
        batch_X, batch_y = batch_X.to(device), batch_y.to(device)
        optimizer.zero_grad()
        outputs = model(batch_X)
        loss = criterion(outputs, batch_y)
        loss.backward()
        optimizer.step()
        train_loss += loss.item() * batch_X.size(0)
    train_loss /= len(train_loader.dataset)
    
    # Evaluate on test data as validation
    model.eval()
    val_loss = 0.0
    with torch.no_grad():
        for batch_X, batch_y in test_loader:
            batch_X, batch_y = batch_X.to(device), batch_y.to(device)
            outputs = model(batch_X)
            loss = criterion(outputs, batch_y)
            val_loss += loss.item() * batch_X.size(0)
    val_loss /= len(test_loader.dataset)
    
    print(f"Epoch {epoch+1}/{num_epochs} -- Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}")
    
    # Check for improvement
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        epochs_without_improvement = 0
        best_model_state = model.state_dict()
    else:
        epochs_without_improvement += 1
        if epochs_without_improvement >= patience:
            print("Early stopping triggered.")
            break

# Load the best model state
model.load_state_dict(best_model_state)

model.eval()
all_probas = []
all_labels = []
with torch.no_grad():
    for batch_X, batch_y in test_loader:
        batch_X = batch_X.to(device)
        outputs = model(batch_X)  # outputs are probabilities because of Sigmoid
        all_probas.append(outputs.cpu())
        all_labels.append(batch_y.cpu())
all_probas = torch.cat(all_probas)
all_labels = torch.cat(all_labels)

# Convert tensors to numpy arrays for metric calculations
y_proba = all_probas.numpy().flatten()
y_true = all_labels.numpy().flatten()
y_pred = (y_proba >= 0.5).astype(int)

accuracy = metrics.accuracy_score(y_true, y_pred)
print("Test Accuracy:", accuracy)

# Calculate Precision, Recall, and F1 Score
precision, recall, f1, _ = metrics.precision_recall_fscore_support(y_true, y_pred, average='binary')
print("Precision:", precision, "Recall:", recall, "F1 Score:", f1)

# Calculate Lift (Top Decile vs Overall)
data = pd.DataFrame({"y": y_true, "y_proba": y_proba})
data.sort_values("y_proba", ascending=False, inplace=True)
top_decile = data.head(int(0.1 * len(data)))
overall_rate = data["y"].mean()
top_decile_rate = top_decile["y"].mean()
lift = top_decile_rate / overall_rate if overall_rate != 0 else float('inf')
print("Lift (Top Decile vs Overall):", lift)
