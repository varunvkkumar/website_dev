from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the React frontend

# Default formulas
default_ibw_formula = "height - 100 if sex == 'Male' else height - 105"
default_rmr_formula = "10 * weight + 6.25 * height - 5 * age + (5 if sex == 'Male' else -161)"
default_tdee_formula = "rmr * activity_level"

def calculate_ibw(height, sex, formula):
    return eval(formula)

def calculate_rmr(weight, height, age, sex, formula):
    return eval(formula)

def calculate_tdee(rmr, activity_level, formula):
    return eval(formula)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    height = data.get('height')
    weight = data.get('weight')
    age = data.get('age')
    sex = data.get('sex')
    activity_level = data.get('activity_level')
    ibw_formula = data.get('ibw_formula', default_ibw_formula)
    rmr_formula = data.get('rmr_formula', default_rmr_formula)
    tdee_formula = data.get('tdee_formula', default_tdee_formula)

    try:
        # Perform calculations based on provided formulas
        ibw = calculate_ibw(height, sex, ibw_formula)
        rmr = calculate_rmr(weight, height, age, sex, rmr_formula)
        tdee = calculate_tdee(rmr, activity_level, tdee_formula)
        
        return jsonify({"ibw": ibw, "rmr": rmr, "tdee": tdee}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5002)  # Run Flask on port 5002

