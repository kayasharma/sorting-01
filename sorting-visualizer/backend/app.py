from flask import Flask, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
import time

# Create Flask application instance
app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)
socketio = SocketIO(app)

# Serve the index.html file when accessing the root URL
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Define the sorting endpoint
@app.route('/sort', methods=['POST'])
def sort_array():
    array = request.json.get('array', [])
    algorithm = request.json.get('algorithm', 'bubble')
    
    if algorithm == 'bubble':
        sorted_array = bubble_sort(array, algorithm)
    elif algorithm == 'insertion':
        sorted_array = insertion_sort(array, algorithm)
    elif algorithm == 'quicksort':
        sorted_array = quick_sort(array, 0, len(array) - 1, algorithm)
    elif algorithm == 'merge':
        sorted_array = merge_sort(array, algorithm)
    elif algorithm == 'heap':
        sorted_array = heap_sort(array, algorithm)
    elif algorithm == 'radix':
        sorted_array = radix_sort(array, algorithm)
    elif algorithm == 'bucket':
        sorted_array = bucket_sort(array, algorithm)
    elif algorithm == 'counting':
        sorted_array = counting_sort(array, algorithm)
    else:
        return jsonify({'error': 'Unknown sorting algorithm'}), 400

    return jsonify({'sortedArray': sorted_array})

# Bubble sort algorithm implementation with real-time updates
def bubble_sort(arr, algorithm):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                # Emit array update to frontend
                socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
                time.sleep(0.5)
    return arr

# Insertion sort algorithm implementation with real-time updates
def insertion_sort(arr, algorithm):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
            # Emit array update to frontend
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)
        arr[j + 1] = key
        socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
        time.sleep(0.5)
    return arr

# Quick sort algorithm implementation with real-time updates
def quick_sort(arr, low, high, algorithm):
    if low < high:
        pi = partition(arr, low, high, algorithm)
        quick_sort(arr, low, pi - 1, algorithm)
        quick_sort(arr, pi + 1, high, algorithm)
    return arr

def partition(arr, low, high, algorithm):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
            # Emit array update to frontend
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
    time.sleep(0.5)
    return i + 1

# Merge sort algorithm implementation with real-time updates
def merge_sort(arr, algorithm):
    if len(arr) > 1:
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]

        merge_sort(left_half, algorithm)
        merge_sort(right_half, algorithm)

        i = j = k = 0
        while i < len(left_half) and j < len(right_half):
            if left_half[i] < right_half[j]:
                arr[k] = left_half[i]
                i += 1
            else:
                arr[k] = right_half[j]
                j += 1
            k += 1
            # Emit array update to frontend
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)

        while i < len(left_half):
            arr[k] = left_half[i]
            i += 1
            k += 1
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)

        while j < len(right_half):
            arr[k] = right_half[j]
            j += 1
            k += 1
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)
    return arr

# Heap sort algorithm implementation with real-time updates
def heap_sort(arr, algorithm):
    def heapify(arr, n, i):
        largest = i
        l = 2 * i + 1
        r = 2 * i + 2

        if l < n and arr[l] > arr[largest]:
            largest = l

        if r < n and arr[r] > arr[largest]:
            largest = r

        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            heapify(arr, n, largest)
            # Emit array update to frontend
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)

    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)
        socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
        time.sleep(0.5)
    return arr

# Radix sort algorithm implementation with real-time updates
def radix_sort(arr, algorithm):
    def counting_sort(arr, exp):
        n = len(arr)
        output = [0] * n
        count = [0] * 10

        for i in range(n):
            index = arr[i] // exp
            count[(index % 10)] += 1

        for i in range(1, 10):
            count[i] += count[i - 1]

        i = n - 1
        while i >= 0:
            index = arr[i] // exp
            output[count[(index % 10)] - 1] = arr[i]
            count[(index % 10)] -= 1
            i -= 1

        for i in range(len(arr)):
            arr[i] = output[i]
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)

    max1 = max(arr)
    exp = 1
    while max1 / exp > 0:
        counting_sort(arr, exp)
        exp *= 10
    return arr

# Bucket sort algorithm implementation with real-time updates
def bucket_sort(arr, algorithm):
    bucket = []
    slot_num = 10
    for i in range(slot_num):
        bucket.append([])

    for j in arr:
        index_b = int(slot_num * j / (max(arr) + 1))
        bucket[index_b].append(j)

    for i in range(slot_num):
        bucket[i] = sorted(bucket[i])
        socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
        time.sleep(0.5)

    k = 0
    for i in range(slot_num):
        for j in range(len(bucket[i])):
            arr[k] = bucket[i][j]
            k += 1
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)
    return arr

# Counting sort algorithm implementation with real-time updates
def counting_sort(arr, algorithm):
    max_val = max(arr)
    m = max_val + 1
    count = [0] * m                

    for a in arr:
        count[a] += 1            

    i = 0
    for a in range(m):            
        for c in range(count[a]):  
            arr[i] = a
            i += 1
            socketio.emit('array update', {'array': arr, 'algorithm': algorithm})
            time.sleep(0.5)
    return arr

# Run the Flask application
if __name__ == '__main__':
    socketio.run(app, debug=True)
