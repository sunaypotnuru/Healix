"""
test_single.py - Updated to use complete pipeline
Path: src/test_single.py
"""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent))
from pipeline import get_pipeline

def main():
    if len(sys.argv) < 2:
        print("\n" + "="*60)
        print("NETRA AI - Single Image Test")
        print("="*60)
        print("\nUsage: python test_single.py <image_path> [--save-heatmap]")
        print("\nOptions:")
        print("  --save-heatmap    Save GradCAM overlay to logs/gradcam_output/")
        print("\nExamples:")
        print('  python test_single.py "path/to/anemic/image.jpg"')
        print('  python test_single.py "path/to/image.png" --save-heatmap')
        print("="*60)
        return
    
    image_path = sys.argv[1]
    save_heatmap = '--save-heatmap' in sys.argv
    
    # Get pipeline (initialized once)
    pipeline = get_pipeline()
    
    # Run prediction
    result = pipeline.predict_from_file(image_path, save_heatmap=save_heatmap)
    
    if not result['success']:
        print(f"\nError: {result['error']}")
        return
    
    # Display results
    print("\n" + "="*60)
    print("NETRA AI - PREDICTION RESULT")
    print("="*60)
    print(f"Image: {Path(image_path).name}")
    print(f"\nProbability: {result['probability']:.4f}")
    print(f"Diagnosis: {'ANEMIC' if result['is_anemic'] else 'NON-ANEMIC'}")
    print(f"Confidence: {result['confidence']:.4f} ({result['confidence']*100:.1f}%)")
    print(f"Severity: {result['severity']}")
    print(f"Hb Estimate: {result['hemoglobin_estimate']} g/dL")
    
    if save_heatmap:
        print(f"\nHeatmap saved to logs/gradcam_output/")
    
    print("="*60)

if __name__ == "__main__":
    main()
