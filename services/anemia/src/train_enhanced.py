"""
NetraAI - Enhanced Training Script (Fixed)
"""
import tensorflow as tf
import matplotlib.pyplot as plt
from datetime import datetime
import json
import sys
from pathlib import Path

# Add path
sys.path.append(str(Path(__file__).parent))

# Import modules
from config import MODELS_DIR, LOGS_DIR, BATCH_SIZE, IMG_SIZE
from data_loader import DataLoader
from model import create_enhanced_model

class EnhancedTrainer:
    def __init__(self):
        self.data_loader = DataLoader()
        self.model = None
        self.history = None
        
    def prepare_data(self):
        """Load and prepare data"""
        print("📂 Loading data...")
        self.train_gen, self.val_gen = self.data_loader.create_generators()
        self.steps_per_epoch = self.train_gen.samples // BATCH_SIZE
        self.val_steps = self.val_gen.samples // BATCH_SIZE
        
    def build_model(self):
        """Build enhanced model"""
        print("🏗️ Building enhanced model...")
        self.model = create_enhanced_model()
        self.model.summary()
        
    def compile_model(self):
        """Compile model with proper settings"""
        self.model.compile(
            loss=tf.keras.losses.BinaryCrossentropy(),
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            metrics=['accuracy', tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
        )
        print("✅ Model compiled")
        
    def get_callbacks(self):
        """Get fixed callbacks with proper parameters"""
        return [
            # Save best model
            tf.keras.callbacks.ModelCheckpoint(
                filepath=str(MODELS_DIR / 'best_enhanced.h5'),
                monitor='val_accuracy',
                save_best_only=True,
                mode='max',
                verbose=1
            ),
            # Early stopping with increased patience
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=30,  # Fixed: increased from 15
                restore_best_weights=True,
                verbose=1,
                mode='min'
            ),
            # Reduce learning rate on plateau
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=10,  # Fixed: increased from 5
                min_lr=1e-7,
                verbose=1,
                mode='min'
            ),
            # Log progress
            tf.keras.callbacks.CSVLogger(
                filename=str(LOGS_DIR / 'enhanced_training.csv'),
                separator=',',
                append=False
            ),
            # TensorBoard for visualization
            tf.keras.callbacks.TensorBoard(
                log_dir=str(LOGS_DIR / 'tensorboard'),
                histogram_freq=1
            )
        ]
    
    def train(self, epochs=100):
        """Train the model"""
        print(f"🚀 Starting training for {epochs} epochs...")
        
        callbacks = self.get_callbacks()
        
        self.history = self.model.fit(
            self.train_gen,
            steps_per_epoch=self.steps_per_epoch,
            validation_data=self.val_gen,
            validation_steps=self.val_steps,
            epochs=epochs,
            callbacks=callbacks,
            verbose=1
        )
        
        print("✅ Training complete!")
        
    def save_results(self):
        """Save training results and plots"""
        
        # Save final model
        final_path = MODELS_DIR / 'enhanced_final.h5'
        self.model.save(final_path)
        print(f"✅ Model saved to {final_path}")
        
        # Plot history
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        
        # Accuracy plot
        axes[0].plot(self.history.history['accuracy'], label='Train', linewidth=2)
        axes[0].plot(self.history.history['val_accuracy'], label='Validation', linewidth=2)
        axes[0].set_title('Model Accuracy', fontsize=14)
        axes[0].set_xlabel('Epoch')
        axes[0].set_ylabel('Accuracy')
        axes[0].legend()
        axes[0].grid(True, alpha=0.3)
        
        # Loss plot
        axes[1].plot(self.history.history['loss'], label='Train', linewidth=2)
        axes[1].plot(self.history.history['val_loss'], label='Validation', linewidth=2)
        axes[1].set_title('Model Loss', fontsize=14)
        axes[1].set_xlabel('Epoch')
        axes[1].set_ylabel('Loss')
        axes[1].legend()
        axes[1].grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(LOGS_DIR / 'enhanced_history.png', dpi=150)
        print(f"✅ Plot saved to {LOGS_DIR / 'enhanced_history.png'}")
        
        # Save metrics
        metrics = {
            'best_val_accuracy': float(max(self.history.history['val_accuracy'])),
            'best_val_loss': float(min(self.history.history['val_loss'])),
            'final_val_accuracy': float(self.history.history['val_accuracy'][-1]),
            'final_val_loss': float(self.history.history['val_loss'][-1]),
            'epochs_completed': len(self.history.history['loss']),
            'total_parameters': self.model.count_params()
        }
        
        with open(LOGS_DIR / 'enhanced_metrics.json', 'w') as f:
            json.dump(metrics, f, indent=2)
            
        print(f"\n📊 Best validation accuracy: {metrics['best_val_accuracy']:.4f}")
        
    def run(self):
        """Run complete pipeline"""
        print("="*60)
        print("NETRA AI - ENHANCED TRAINING (FIXED)")
        print("="*60)
        
        self.prepare_data()
        self.build_model()
        self.compile_model()
        self.train(epochs=100)
        self.save_results()
        
        print("="*60)
        print("✅ ALL DONE! Model is ready for testing.")
        print("="*60)

if __name__ == "__main__":
    trainer = EnhancedTrainer()
    trainer.run()
