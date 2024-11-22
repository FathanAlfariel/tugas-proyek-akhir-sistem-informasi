import requests
from datetime import datetime

class BagProductionEstimator:
    def __init__(self, api_url='http://localhost:5000/estimate-production'):
        self.api_url = api_url

    def calculate_production_time(self, materials, size='medium', additional_features=None):
        """
        Menghitung estimasi waktu produksi tas dengan beberapa bahan
        """
        data = {
            'materials': materials,
            'size': size,
            'additional_features': additional_features or [],
        }
        
        response = requests.post(self.api_url, json=data)
        
        if response.status_code == 200:
            result = response.json()
            return result['totalHours'], result['baseTimes'], result['estimatedCompletionDate']
        else:
            raise ValueError(f"Error fetching production time: {response.json().get('error')}")

# Contoh penggunaan
def main():
    estimator = BagProductionEstimator()
    
    materials = ['kulit', 'canvas']  # Contoh menggunakan dua bahan
    size = 'medium'
    additional_features = ['zipper_pocket', 'shoulder_strap']
    
    try:
        # Menghitung waktu produksi dari API Node.js
        total_hours, breakdown_times, estimated_completion_date = estimator.calculate_production_time(
            materials=materials,
            size=size,
            additional_features=additional_features
        )
        
        # Menampilkan hasil
        print(f"\nEstimasi Produksi Tas ({', '.join(materials)} - {size}):")
        print(f"Total waktu produksi: {total_hours:.2f} jam")
        print("\nBreakdown waktu:")
        for step, time in breakdown_times.items():
            print(f"- {step}: {time:.2f} jam")
        print(f"\nTanggal estimasi selesai: {estimated_completion_date}")
        
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
