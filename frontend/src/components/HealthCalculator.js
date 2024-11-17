import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HealthCalculator.css';  // Import your custom CSS file

const HealthCalculator = () => {
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [age, setAge] = useState(30);
    const [sex, setSex] = useState("Male");
    const [activityLevel, setActivityLevel] = useState(1.5);
    const [ibwFormula, setIbwFormula] = useState("height - 100 if sex == 'Male' else height - 105");
    const [rmrFormula, setRmrFormula] = useState("10 * weight + 6.25 * height - 5 * age + (5 if sex == 'Male' else -161)");
    const [tdeeFormula, setTdeeFormula] = useState("rmr * activity_level");
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleCalculate = async () => {
        try {
            const response = await axios.post('http://localhost:5002/calculate', {
                height, weight, age, sex, activity_level: activityLevel,
                ibw_formula: ibwFormula, rmr_formula: rmrFormula, tdee_formula: tdeeFormula
            });
            setResults(response.data);
            setError(null);
        } catch (error) {
            setError(error.response ? error.response.data.error : "An error occurred");
            setResults(null);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="calculator-card">
                <h2 className="text-center mb-4">Health Metrics Calculator</h2>
                
                <div className="form-group">
                    <label>Height (cm):</label>
                    <input type="number" className="form-control" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} />
                </div>
                
                <div className="form-group">
                    <label>Weight (kg):</label>
                    <input type="number" className="form-control" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} />
                </div>
                
                <div className="form-group">
                    <label>Age:</label>
                    <input type="number" className="form-control" value={age} onChange={(e) => setAge(parseInt(e.target.value))} />
                </div>
                
                <div className="form-group">
                    <label>Sex:</label>
                    <select className="form-control" value={sex} onChange={(e) => setSex(e.target.value)}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Activity Level: {activityLevel}</label>
                    <input
                        type="range"
                        className="form-range"
                        min="1.2"
                        max="2.0"
                        step="0.1"
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                    />
                    <div className="d-flex justify-content-between">
                        <small>1.2</small>
                        <small>2.0</small>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>IBW Formula:</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={ibwFormula}
                        onChange={(e) => setIbwFormula(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <label>RMR Formula:</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={rmrFormula}
                        onChange={(e) => setRmrFormula(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <label>TDEE Formula:</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={tdeeFormula}
                        onChange={(e) => setTdeeFormula(e.target.value)}
                    />
                </div>
                
                <button className="btn btn-primary btn-block mt-3" onClick={handleCalculate}>Calculate</button>
                
                {results && (
                    <div className="mt-4">
                        <h4>Results:</h4>
                        <p>IBW: {results.ibw} kg</p>
                        <p>RMR: {results.rmr} kcal/day</p>
                        <p>TDEE: {results.tdee} kcal/day</p>
                    </div>
                )}
                {error && <p className="text-danger mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default HealthCalculator;









