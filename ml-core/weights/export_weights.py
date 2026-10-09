import json
import onnx

MODEL_NUMBER = 4
FILE_NAME = f'engine_{MODEL_NUMBER}'

model = onnx.load(f"../models/{FILE_NAME}.onnx")

weights_dict = {}

for init in model.graph.initializer:
  weights_dict[init.name] = onnx.numpy_helper.to_array(init).tolist()

with open(f"../models/weights/{FILE_NAME}.json", "w") as f:
    json.dump(weights_dict, f)

print(f"Weights exported successfully from ONNX to {FILE_NAME}.json!")