"""
Training with the proven architecture
"""
import tensorflow as tf
import matplotlib.pyplot as plt
from datetime import datetime
import json
from config import MODELS_DIR, LOGS_DIR, EPOCHS
from data_loader import DataLoader
from model import create_model

# Load data
loader = DataLoader()
train_gen, val_gen = loader.create_generators()

# Create model
model = create_model()
model.summary()

# Compile - EXACT same as original
model.compile(
    loss=tf.keras.losses.BinaryCrossentropy(),
    optimizer=tf.keras.optimizers.Adam(),
    metrics=['accuracy']
)

# Train - 100 epochs like original
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS,
    callbacks=[
        tf.keras.callbacks.ModelCheckpoint(
            str(MODELS_DIR / 'best_model.h5'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max'
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=15,
            restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=5,
            min_lr=1e-7
        )
    ],
    verbose=1
)

# Save final model
model.save(MODELS_DIR / 'final_model.h5')

# Plot and save history
plt.figure(figsize=(12,4))
plt.subplot(1,2,1)
plt.plot(history.history['accuracy'], label='Train')
plt.plot(history.history['val_accuracy'], label='Validation')
plt.title('Accuracy')
plt.legend()

plt.subplot(1,2,2)
plt.plot(history.history['loss'], label='Train')
plt.plot(history.history['val_loss'], label='Validation')
plt.title('Loss')
plt.legend()

plt.savefig(LOGS_DIR / 'training_history.png')
# plt.show() # Commented out to avoid blocking execution

# Save metrics
metrics = {
    'best_val_accuracy': float(max(history.history['val_accuracy'])),
    'final_val_accuracy': float(history.history['val_accuracy'][-1]),
    'epochs_completed': len(history.history['loss'])
}

with open(LOGS_DIR / 'metrics.json', 'w') as f:
    json.dump(metrics, f, indent=2)

print(f"\n🎯 Best validation accuracy: {metrics['best_val_accuracy']:.4f}")
