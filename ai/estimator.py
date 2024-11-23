from flask import Flask, request, jsonify
import numpy as np
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

def calculate_production_time(materials, total_quantity, material_characteristics):
    total_cutting_time = 0
    total_sewing_time = 0
    complexity_factor = 0
    
    for material in materials:
        material_name = material["material"]
        quantity = material["quantity"]
        size = material["size"]
        
        if material_name in material_characteristics:
            char = material_characteristics[material_name]
            
            # Menghitung waktu berdasarkan karakteristik material
            material_cutting_time = char["cutting_time"] * size * quantity
            material_sewing_time = char["sewing_time"] * size * quantity
            
            total_cutting_time += material_cutting_time
            total_sewing_time += material_sewing_time
            complexity_factor = max(complexity_factor, char["complexity"])
    
    # Menghitung total waktu produksi
    base_time = total_cutting_time + total_sewing_time
    
    # Menerapkan faktor kompleksitas dan skala produksi
    scale_factor = 0.85  # Efisiensi skala (dapat disesuaikan)
    total_time = (base_time * complexity_factor * total_quantity) * scale_factor
    
    # Menghitung estimasi per tahap
    cutting_estimate = (total_cutting_time * total_quantity) * scale_factor
    sewing_estimate = (total_sewing_time * total_quantity) * scale_factor
    
    return {
        "total_estimated_hours": round(total_time, 2),
        "cutting_hours": round(cutting_estimate, 2),
        "sewing_hours": round(sewing_estimate, 2),
        "complexity_factor": round(complexity_factor, 2)
    }

@app.route('/estimate', methods=['POST'])
def estimate_production():
    try:
        data = request.json
        materials = data["materials"]
        total_quantity = data["totalQuantity"]
        material_characteristics = data["materialCharacteristics"]
        
        result = calculate_production_time(materials, total_quantity, material_characteristics)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=3000)
