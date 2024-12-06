from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

# Create Flask application instance
app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Serve the index.html file when accessing the root URL
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Define the sorting endpoint
@app.route('/sort', methods=['POST'])
def sort_array():
    array = request.json.get('array', [])
    sorted_array = bubble_sort(array)
    return jsonify({'sortedArray': sorted_array})

# Bubble sort algorithm implementation
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
