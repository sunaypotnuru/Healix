"""
camera_capture.py - Capture images from webcam for NetraAI
"""

import cv2
import sys
from pathlib import Path
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import threading
import time

# Lazy load pipeline to prevent startup freeze
# sys.path.append(str(Path(__file__).parent))
# from pipeline import get_pipeline

class CameraCaptureApp:
    def __init__(self, root):
        self.root = root
        self.root.title("NetraAI - Eye Camera Capture")
        self.root.geometry("900x700")
        self.root.configure(bg='#f0f0f0')
        
        self.pipeline = None
        self.model_loaded = False
        self.camera = None
        self.is_running = False
        self.current_frame = None
        self.last_result = None
        
        self.setup_ui()
        
        # Start loading model in background
        self.status_label.config(text="Initializing AI Model... Please wait...", fg="#e67e22")
        threading.Thread(target=self.load_pipeline, daemon=True).start()
        
    def load_pipeline(self):
        """Load the heavy AI pipeline in background"""
        try:
            # Import here to avoid freezing UI at startup
            sys.path.append(str(Path(__file__).parent))
            from pipeline import get_pipeline
            
            self.pipeline = get_pipeline()
            self.model_loaded = True
            
            # Update UI from main thread
            self.root.after(0, lambda: self.status_label.config(text="AI Ready! Start Camera to begin.", fg="#27ae60"))
            self.root.after(0, lambda: self.start_btn.config(state=tk.NORMAL))
            
        except Exception as e:
            error_msg = f"Failed to load model: {str(e)}"
            print(error_msg)
            self.root.after(0, lambda: messagebox.showerror("Error", error_msg))
            self.root.after(0, lambda: self.status_label.config(text="Model Failed to Load", fg="#c0392b"))

    def setup_ui(self):
        """Setup the user interface"""
        
        # Title
        title = tk.Label(self.root, text="NetraAI Eye Scanner", 
                        font=("Arial", 20, "bold"), bg='#f0f0f0', fg='#2c3e50')
        title.pack(pady=10)
        
        # Status Label (New)
        self.status_label = tk.Label(self.root, text="Using TensorFlow/OpenCV", 
                                   font=("Arial", 12, "italic"), bg='#f0f0f0', fg='#7f8c8d')
        self.status_label.pack(pady=5)
        
        # Instructions
        instr = tk.Label(self.root, 
                        text="Position your eye in the frame\nPull down lower eyelid gently\nPress SPACE to capture",
                        font=("Arial", 12), bg='#f0f0f0', fg='#34495e')
        instr.pack(pady=5)
        
        # Main frame for camera and result
        main_frame = tk.Frame(self.root, bg='#f0f0f0')
        main_frame.pack(pady=10, padx=20, fill=tk.BOTH, expand=True)
        
        # Camera frame
        camera_frame = tk.LabelFrame(main_frame, text="Camera Feed", 
                                     font=("Arial", 12), bg='#f0f0f0')
        camera_frame.pack(side=tk.LEFT, padx=10, fill=tk.BOTH, expand=True)
        
        self.camera_label = tk.Label(camera_frame, bg='black')
        self.camera_label.pack(padx=5, pady=5)
        
        # Result frame
        result_frame = tk.LabelFrame(main_frame, text="Results", 
                                     font=("Arial", 12), bg='#f0f0f0')
        result_frame.pack(side=tk.RIGHT, padx=10, fill=tk.BOTH, expand=True)
        
        # Result display
        self.result_text = tk.Text(result_frame, height=15, width=30, 
                                   font=("Arial", 11), bg='white')
        self.result_text.pack(padx=5, pady=5, fill=tk.BOTH, expand=True)
        
        # Control buttons
        button_frame = tk.Frame(self.root, bg='#f0f0f0')
        button_frame.pack(pady=10)
        
        # Start button initially disabled until model loads
        self.start_btn = tk.Button(button_frame, text="Start Camera", 
                                   command=self.start_camera,
                                   bg='#27ae60', fg='white', font=("Arial", 11, "bold"),
                                   padx=20, pady=8, state=tk.DISABLED)
        self.start_btn.pack(side=tk.LEFT, padx=5)
        
        self.capture_btn = tk.Button(button_frame, text="Capture", 
                                     command=self.capture_image,
                                     bg='#3498db', fg='white', font=("Arial", 11, "bold"),
                                     padx=20, pady=8, state=tk.DISABLED)
        self.capture_btn.pack(side=tk.LEFT, padx=5)
        
        self.stop_btn = tk.Button(button_frame, text="Stop Camera", 
                                  command=self.stop_camera,
                                  bg='#e74c3c', fg='white', font=("Arial", 11, "bold"),
                                  padx=20, pady=8, state=tk.DISABLED)
        self.stop_btn.pack(side=tk.LEFT, padx=5)
        
        # Instructions for proper capture
        tip_frame = tk.LabelFrame(self.root, text="Tips for Best Results", 
                                  font=("Arial", 10), bg='#f0f0f0')
        tip_frame.pack(pady=10, padx=20, fill=tk.X)
        
        tips = [
            "Good lighting - natural light works best",
            "Get CLOSE to the camera - eye should fill the frame",
            "Pull down lower eyelid gently to show pink tissue",
            "Hold steady - avoid blur",
            "Remove glasses if possible"
        ]
        
        for tip in tips:
            tk.Label(tip_frame, text=tip, bg='#f0f0f0', fg='#2c3e50', 
                    font=("Arial", 9)).pack(anchor='w', padx=10)
        
        # Bind keyboard
        self.root.bind('<space>', lambda e: self.capture_image())
        
    def start_camera(self):
        """Start the camera"""
        if not self.model_loaded:
            messagebox.showwarning("Wait", "Please wait for the AI model to finish loading.")
            return

        try:
            self.camera = cv2.VideoCapture(0)
            if not self.camera.isOpened():
                messagebox.showerror("Error", "Could not open camera")
                return
            
            self.is_running = True
            self.start_btn.config(state=tk.DISABLED)
            self.capture_btn.config(state=tk.NORMAL)
            self.stop_btn.config(state=tk.NORMAL)
            self.status_label.config(text="Camera Active - Press SPACE to Capture", fg="#2980b9")
            
            self.update_frame()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to start camera: {e}")
    
    def update_frame(self):
        """Update camera frame"""
        if self.is_running:
            ret, frame = self.camera.read()
            if ret:
                # Store current frame
                self.current_frame = frame.copy()
                
                # Convert for display
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frame_rgb = cv2.resize(frame_rgb, (480, 360))
                
                img = Image.fromarray(frame_rgb)
                imgtk = ImageTk.PhotoImage(image=img)
                
                self.camera_label.config(image=imgtk)
                self.camera_label.image = imgtk
            
            self.root.after(30, self.update_frame)
    
    def capture_image(self):
        """Capture current frame and run prediction"""
        if self.current_frame is None:
            return
            
        if not self.model_loaded:
            return
        
        # Save temporary image to ORIGINALS_DIR
        try:
            from config import ORIGINALS_DIR
            import uuid
            from datetime import datetime
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            filename = f"capture_{timestamp}_{unique_id}.jpg"
            save_path = ORIGINALS_DIR / filename
            
            cv2.imwrite(str(save_path), self.current_frame)
            self.status_label.config(text="Processing...", fg="#e67e22")
            
            # Run prediction in thread to prevent UI freeze
            threading.Thread(target=self.run_prediction, args=(save_path,), daemon=True).start()
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save image: {e}")
    
    def run_prediction(self, image_path):
        """Run prediction in background"""
        try:
            # Pass save_original=False because we already saved it manually
            result = self.pipeline.predict_from_file(str(image_path), save_heatmap=True, save_original=False)
            
            # Update UI
            self.root.after(0, lambda: self.display_result(result))
            self.root.after(0, lambda: self.status_label.config(text="Done! Ready for next capture.", fg="#2980b9"))
            
        except Exception as e:
            self.root.after(0, lambda: messagebox.showerror("Error", f"Prediction failed: {e}"))
            self.root.after(0, lambda: self.status_label.config(text="Error in prediction", fg="red"))
    
    def display_result(self, result):
        """Display prediction results"""
        self.result_text.delete(1.0, tk.END)
        
        if not result['success']:
            self.result_text.insert(tk.END, f"Error: {result['error']}")
            return
        
        # Color coding
        diagnosis = "ANEMIC" if result['is_anemic'] else "NON-ANEMIC"
        color = "red" if result['is_anemic'] else "green"
        
        self.result_text.insert(tk.END, "PREDICTION RESULTS\n", "bold")
        self.result_text.insert(tk.END, "="*30 + "\n\n")
        
        self.result_text.insert(tk.END, "Diagnosis: ", "bold")
        self.result_text.insert(tk.END, f"{diagnosis}\n", color)
        
        self.result_text.insert(tk.END, "Confidence: ", "bold")
        self.result_text.insert(tk.END, f"{result['confidence']:.1%}\n")
        
        self.result_text.insert(tk.END, "Severity: ", "bold")
        self.result_text.insert(tk.END, f"{result['severity']}\n")
        
        self.result_text.insert(tk.END, "Hb Estimate: ", "bold")
        self.result_text.insert(tk.END, f"{result['hemoglobin_estimate']} g/dL\n\n")
        
        self.result_text.insert(tk.END, "Image saved to:\n")
        self.result_text.insert(tk.END, f"{result.get('input_image_path', 'N/A')}\n\n")
        
        self.result_text.insert(tk.END, "Heatmap saved to:\n")
        self.result_text.insert(tk.END, f"{result.get('heatmap_path', 'N/A')}\n")
        
        # Configure text tags
        self.result_text.tag_configure("bold", font=("Arial", 11, "bold"))
        self.result_text.tag_configure("red", foreground="red", font=("Arial", 11, "bold"))
        self.result_text.tag_configure("green", foreground="green", font=("Arial", 11, "bold"))
    
    def stop_camera(self):
        """Stop the camera"""
        self.is_running = False
        if self.camera:
            self.camera.release()
        
        self.camera_label.config(image='')
        self.start_btn.config(state=tk.NORMAL)
        self.capture_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.DISABLED)
        self.status_label.config(text="Camera Stopped", fg="#7f8c8d")

def main():
    root = tk.Tk()
    app = CameraCaptureApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
