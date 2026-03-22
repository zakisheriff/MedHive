import sys
import json
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder

def load_assets():
    with open('rain_model_metadata.json', 'r') as f:
        meta = json.load(f)
    
    le_dist = LabelEncoder()
    le_dist.classes_ = np.array(meta['district_classes'])
    le_dis = LabelEncoder()
    le_dis.classes_ = np.array(meta['disease_classes'])
    
    model = xgb.XGBRegressor()
    model.load_model('xgb_rain_model.json')
    
    return model, le_dist, le_dis, meta['feature_names']

def generate_matrix_report():
    try:
        model, le_district, le_disease, feature_names = load_assets()
        df = pd.read_csv('rain_correlated_lag_dataset.csv')
        
        # Define target period (Week 1, 2026 as requested)
        target_year = 2026
        target_week = 1
        
        # Calculate previous week for lag lookup
        prev_year = target_year - 1 if target_week == 1 else target_year
        prev_week = 52 if target_week == 1 else target_week - 1
        
        # Specific Diseases and Districts (RDHS Order)
        diseases = ["Dengue Fever", "Leptospirosis", "Dysentery", "Enteric Fever", "Viral Hepatitis"]
        districts = [
            "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
            "Galle", "Hambantota", "Matara", "Jaffna", "Kilinochchi", "Mannar", 
            "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee", 
            "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
            "Monaragala", "Ratnapura", "Kegalle", "Kalmunai"
        ]
        
        matrix_report = []

        for dist in districts:
            dist_row = {"district": dist, "breakdown": {}, "total": 0}
            
            for dis in diseases:
                # Find the history row for this specific district/disease
                prev_row_query = df[
                    (df['year'] == prev_year) & 
                    (df['week_no'] == prev_week) & 
                    (df['district'] == dist) & 
                    (df['disease_name_in_full_form'] == dis)
                ]
                
                if not prev_row_query.empty:
                    p = prev_row_query.iloc[0]
                    
                    # Exact input mapping with shifted lags
                    input_row = {
                        'year': target_year,
                        'week_sin': np.sin(2 * np.pi * target_week / 52),
                        'week_cos': np.cos(2 * np.pi * target_week / 52),
                        'district_enc': le_district.transform([dist])[0],
                        'disease_enc': le_disease.transform([dis])[0],
                        
                        # Shifting Lags
                        'cases_lag1': p['cases'],
                        'cases_lag2': p['cases_lag1'],
                        'cases_lag3': p['cases_lag2'],
                        'cases_lag4': p['cases_lag3'],
                        
                        # Precipitation Lags (Static from previous week)
                        'precip_lag1': p['precip_lag1'], 
                        'precip_lag2': p['precip_lag2'],
                        'precip_lag3': p['precip_lag3'],
                        'precip_lag4': p['precip_lag4']
                    }
                    
                    # Make Prediction
                    input_df = pd.DataFrame([input_row])[feature_names]
                    pred = int(round(max(0, model.predict(input_df)[0])))
                    dist_row["breakdown"][dis] = pred
                    dist_row["total"] += pred
                else:
                    dist_row["breakdown"][dis] = 0 # Default if no history
            
            # Risk logic
            dist_row["risk"] = "High" if dist_row["total"] > 100 else "Moderate" if dist_row["total"] > 40 else "Low"
            matrix_report.append(dist_row)

        # Output to Node.js
        print(json.dumps({
            "metadata": {"year": target_year, "week": target_week},
            "districts": matrix_report,
            "diseases": diseases # Sent for table headers
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    generate_matrix_report()