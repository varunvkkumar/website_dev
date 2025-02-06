from flask import Flask, request, jsonify
from flask_cors import CORS
from math import *
import re
import json
import os
import openai
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the React frontend

openai_client = OpenAI()

FEATURES_FILE = 'backend/data/features.json'
ENGINEERED_FEATURES_FILE = 'backend/data/engineered_features.json'
FORMULAS_FILE = 'backend/data/formulas.json'

def read_json(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, 'r') as file:
        return json.load(file)

def write_json(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

def get_completion_from_messages_json(
    system_text: str,
    user_text,
    model="gpt-4o",
    temperature=0,
    max_tokens=500
):
    """
    Takes the raw text from the prior step and asks the model to convert it into valid JSON.
    This is handy if the first step doesn't perfectly return JSON every time.
    """
    response = openai_client.chat.completions.create(
        model=model,
        messages=[
            {
            "role": "system",
            "content": system_text,
            },
            {
            "role": "user",
            "content": user_text,
            }
        ],
        temperature=temperature,
        max_tokens=max_tokens
    )
    return response.choices[0].message.content

@app.route('/transform_with_openai', methods=['POST'])
def transform_with_openai():
    data = request.json
    feature_id = data.get('feature')
    print(feature_id)
    system_prompt = data.get('system_prompt')
    print(system_prompt)
    if not feature_id or not system_prompt:
        return jsonify({"error": "Feature and system prompt are required."}), 400

    features = read_json(FEATURES_FILE) + read_json(ENGINEERED_FEATURES_FILE)
    
    feature = next((f for f in features if f['id'] == feature_id), None)
    if not feature:
        return jsonify({"error": "Feature not found."}), 404
    print(feature)
    transformed_values = []
    for value_obj in feature.get('values', []):
        value = value_obj.get('value')
        if value is not None:
            transformed_value = get_completion_from_messages_json(system_prompt, str(value))
            transformed_values.append({
                "original_value": value,
                "transformed_value": transformed_value
            })
    return jsonify({"transformed_values": transformed_values}), 200

@app.route('/calculate_features', methods=['POST'])
def calculate_features():
    data = request.json
    features = data.get('features')
    formulas = data.get('formulas')

    if not features or not formulas:
        return jsonify({"error": "Features and formulas are required."}), 400

    results = {}

    try:
        # Create a dictionary to map feature IDs to their values
        feature_map = {feature['id']: feature for feature in features}

        for formula in formulas:
            formula_label = formula['label']
            formula_expression = formula['formula']
            results[formula_label] = {}

            # Extract the variables (feature IDs) from the formula using regex
            variables = re.findall(r'\b\w+\b', formula_expression)
            variables = [var for var in variables if var in feature_map]

            if not variables:
                return jsonify({"error": f"No matching feature found for formula: {formula_expression}"}), 400

            # Ensure all variables are present in the feature map
            missing_vars = [var for var in variables if var not in feature_map]
            if missing_vars:
                return jsonify({"error": f"Missing features for formula: {formula_expression}. Missing variables: {', '.join(missing_vars)}"}), 400

            # Prepare a list of feature values for each variable
            feature_values_list = [feature_map[var]['values'] for var in variables]

            # Determine the maximum number of values among all features
            max_values_length = max(len(values) for values in feature_values_list)

            for i in range(max_values_length):
                variables_dict = {}
                transformed_entry = {
                    "valueId": None,
                    "valueName": None,
                    "result": None
                }
                valid_entry = True

                for j in range(len(feature_values_list)):
                    if i < len(feature_values_list[j]):
                        entry = feature_values_list[j][i]
                        value_id = entry['valueId']
                        value_name = entry['valueName']
                        value = entry['value']

                        # Prepare the variables for evaluation
                        variables_dict[variables[j]] = value

                        # Set valueId and valueName for the transformed entry
                        if transformed_entry["valueId"] is None:
                            transformed_entry["valueId"] = value_id
                        if transformed_entry["valueName"] is None:
                            transformed_entry["valueName"] = value_name
                    else:
                        valid_entry = False

                # Evaluate the formula with all variables if valid_entry is True
                if valid_entry:
                    result = eval(formula_expression, {"__builtins__": None}, variables_dict)
                    transformed_entry["result"] = result

                if f"Entry {i + 1}" not in results[formula_label]:
                    results[formula_label][f"Entry {i + 1}"] = []
                results[formula_label][f"Entry {i + 1}"].append(transformed_entry)

        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/save_transformed_features', methods=['POST'])
def save_transformed_features():
    data = request.json
    transformed_features = data.get('transformed_features')

    if not transformed_features:
        return jsonify({"error": "Transformed features are required."}), 400

    existing_features = read_json(ENGINEERED_FEATURES_FILE)
    existing_features.extend(transformed_features)
    write_json(existing_features, ENGINEERED_FEATURES_FILE)

    return jsonify({"message": "Transformed features saved successfully."}), 200

@app.route('/api/formulas/<id>', methods=['PUT'])
def update_formula(id):
    data = request.json
    updated_formula = {
        "id": id,
        "label": data.get('label'),
        "formula": data.get('formula')
    }

    formulas = read_json(FORMULAS_FILE)
    formula_index = next((index for (index, f) in enumerate(formulas) if f['id'] == id), None)

    if formula_index is None:
        return jsonify({"error": "Formula not found."}), 404

    formulas[formula_index] = updated_formula
    write_json(formulas, FORMULAS_FILE)

    return jsonify({"message": "Formula updated successfully."}), 200

@app.route('/api/features', methods=['GET'])
def get_features():
    features = read_json(FEATURES_FILE)
    engineered_features = read_json(ENGINEERED_FEATURES_FILE)
    all_features = features + engineered_features
    return jsonify(all_features), 200

@app.route('/api/engineered_features', methods=['GET'])
def get_engineered_features():
    engineered_features = read_json(ENGINEERED_FEATURES_FILE)
    return jsonify(engineered_features), 200

if __name__ == '__main__':
    app.run(debug=True, port=5002)  # Run Flask on port 5002
