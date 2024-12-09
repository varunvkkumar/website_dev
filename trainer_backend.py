import streamlit as st
import pandas as pd

# Load data from uploaded files
case_studies_path = 'Emperical data V2.0.xlsx - Case studies.csv'
key_variables_path = 'Emperical data V2.0.xlsx - Key Variables.csv'

# Load CSVs directly in the app
case_studies_df = pd.read_csv(case_studies_path).dropna(how='all').reset_index(drop=True)
key_variables_df = pd.read_csv(key_variables_path).dropna(how='all').reset_index(drop=True)

# Clean Case Studies Data
case_studies_df.columns = case_studies_df.iloc[4]  # Set headers
case_studies_df = case_studies_df.drop([0, 1, 2, 3, 4]).reset_index(drop=True)

# Ensure all columns are unique in Case Studies Data
case_studies_df.columns = [
    f"{col}_{i}" if pd.isna(col) or col in case_studies_df.columns[:i] else col
    for i, col in enumerate(case_studies_df.columns)
]

# Clean Key Variables Data
key_variables_df.columns = key_variables_df.iloc[0]  # Set headers
key_variables_df = key_variables_df.drop([0]).reset_index(drop=True)

# Ensure all columns in key_variables_df are unique
key_variables_df.columns = [
    f"{col}_{i}" if pd.isna(col) or col in key_variables_df.columns[:i] else col
    for i, col in enumerate(key_variables_df.columns)
]

# Default calculation functions
def calculate_ibw(height, sex, ibw_formula):
    # Evaluate custom or default IBW formula
    return eval(ibw_formula)

def calculate_rmr(weight, height, age, sex, rmr_formula):
    # Evaluate custom or default RMR formula
    return eval(rmr_formula)

def calculate_tdee(rmr, activity_level, tdee_formula):
    # Evaluate custom or default TDEE formula
    return eval(tdee_formula)

# Streamlit Interface
st.title("Health Metrics Calculator")

# Generate input fields for each manually defined key variable
st.sidebar.header("User Inputs")
user_inputs = {}

# Manually create input fields for each expected key variable
user_inputs["Height"] = st.sidebar.number_input("Height (cm)", min_value=100.0, max_value=250.0, value=170.0)
user_inputs["Current body weight"] = st.sidebar.number_input("Current body weight (kg)", min_value=30.0, max_value=200.0, value=70.0)
user_inputs["Age"] = st.sidebar.number_input("Age", min_value=10, max_value=100, value=30)
user_inputs["Sex"] = st.sidebar.selectbox("Sex", ["Male", "Female"])
user_inputs["Activity Level"] = st.sidebar.slider("Activity Level", min_value=1.2, max_value=2.0, step=0.1, value=1.5)

# Default formulas
default_ibw_formula = "height - 100 if sex == 'Male' else height - 105"
default_rmr_formula = "10 * weight + 6.25 * height - 5 * age + (5 if sex == 'Male' else -161)"
default_tdee_formula = "rmr * activity_level"

# Editable fields for formulas
st.sidebar.header("Formulas (Editable)")
ibw_formula = st.sidebar.text_input("IBW Formula", default_ibw_formula)
rmr_formula = st.sidebar.text_input("RMR Formula", default_rmr_formula)
tdee_formula = st.sidebar.text_input("TDEE Formula", default_tdee_formula)

# Perform calculations using the formulas
height = user_inputs["Height"]
weight = user_inputs["Current body weight"]
age = user_inputs["Age"]
sex = user_inputs["Sex"]
activity_level = user_inputs["Activity Level"]

try:
    # Calculate metrics based on user-defined or default formulas
    ibw = calculate_ibw(height, sex, ibw_formula)
    rmr = calculate_rmr(weight, height, age, sex, rmr_formula)
    tdee = calculate_tdee(rmr, activity_level, tdee_formula)
except Exception as e:
    st.error(f"Error in formula calculation: {e}")
    ibw, rmr, tdee = None, None, None

# Display results
st.subheader("Calculated Results")
if ibw is not None:
    st.write(f"Ideal Body Weight (IBW): {ibw} kg")
if rmr is not None:
    st.write(f"Resting Metabolic Rate (RMR): {rmr:.2f} kcal/day")
if tdee is not None:
    st.write(f"Total Daily Energy Expenditure (TDEE): {tdee:.2f} kcal/day")

# Display reference dataframes for case studies and key variables with unique column names
st.subheader("Reference Data")
st.write("Case Studies Data")
st.dataframe(case_studies_df)
st.write("Key Variables Data")
st.dataframe(key_variables_df)







