import os
import sys
from onnxruntime.tools.convert_onnx_models_to_ort import convert_onnx_models_to_ort

def convert_onnx_to_ort(path: str):
    if not os.path.exists(path):
        print("Error: File does not exist")
        return

    print(f"Conversion: {path}...")
    try:
        convert_onnx_models_to_ort(path)
        output_path = path.replace(".onnx", ".ort")
        
        old_size = os.path.getsize(path) / 1024**2
        new_size = os.path.getsize(output_path) / 1024**2
        
        print(f"Ready! {old_size:.2f}MB -> {new_size:.2f}MB")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: uv run script.py model.onnx")
    else:
        convert_onnx_to_ort(sys.argv[1])