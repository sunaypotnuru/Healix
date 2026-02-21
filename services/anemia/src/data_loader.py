"""
NetraAI - Fixed Data Loader
"""
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from config import TRAIN_DIR, VAL_DIR, IMG_SIZE, BATCH_SIZE

class DataLoader:
    def __init__(self):
        self.train_dir = TRAIN_DIR
        self.val_dir = VAL_DIR
        self.img_size = (IMG_SIZE, IMG_SIZE)
        self.batch_size = BATCH_SIZE
    
    def create_generators(self):
        """Create train and validation generators"""
        
        # Training with augmentation
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        )
        
        # Validation only rescaling
        val_datagen = ImageDataGenerator(rescale=1./255)
        
        # Create generators
        train_gen = train_datagen.flow_from_directory(
            directory=str(self.train_dir),
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='binary',
            classes=['Non-Anemic', 'Anemic'],
            shuffle=True,
            seed=42
        )
        
        val_gen = val_datagen.flow_from_directory(
            directory=str(self.val_dir),
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='binary',
            classes=['Non-Anemic', 'Anemic'],
            shuffle=False,
            seed=42
        )
        
        print(f"✅ Data loaded: {train_gen.samples} training, {val_gen.samples} validation")
        return train_gen, val_gen
