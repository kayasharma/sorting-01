// Declare the variable at the top of the script.
let currentArray = [];

// Function to show input fields for the array
function showElementsInput() {
  const numElements = document.getElementById("numElements").value;
  if (numElements > 0) {
    document.getElementById("elementsInput").style.display = "block";
    document.getElementById("sortButton").style.display = "block";
  }
}

// Function to sort the array based on the chosen algorithm
function sortArray() {
  const elementsInput = document.getElementById("elementsInput").value;
  currentArray = elementsInput.split(",").map(Number);
  visualizeArray(currentArray); // Visualize the input array before sorting
  const algorithm = document.getElementById("sortingAlgorithm").value;
  switch (algorithm) {
    case "bubble":
      bubbleSort(currentArray);
      break;
    case "insertion":
      insertionSort(currentArray);
      break;
    case "quicksort":
      quickSort(currentArray, 0, currentArray.length - 1);
      break;
    case "merge":
      mergeSort(currentArray);
      break;
    case "heap":
      heapSort(currentArray);
      break;
    case "radix":
      radixSort(currentArray);
      break;
    case "bucket":
      bucketSort(currentArray);
      break;
    case "counting":
      countingSort(currentArray);
      break;
    default:
      bubbleSort(currentArray);
  }
}

// Function to reset the array visualization
function resetArray() {
  visualizeArray(currentArray); // Visualize the original array
}

// Function to visualize the array using bars
function visualizeArray(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  arrayContainer.innerHTML = "";
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bubble");
    bar.style.height = `${value * 5}px`; // Adjust height for visualization
    bar.textContent = value;
    arrayContainer.appendChild(bar);
  });
}

// Function to compare sorting algorithms (placeholder)
function compareAlgorithms() {
  console.log("Comparison of sorting algorithms is not yet implemented.");
}

// Event listeners for buttons
document
  .getElementById("generateInputFields")
  .addEventListener("click", showElementsInput);
document.getElementById("sortButton").addEventListener("click", sortArray);
document.getElementById("resetButton").addEventListener("click", resetArray);
document
  .getElementById("compareButton")
  .addEventListener("click", compareAlgorithms);

// Bubble Sort implementation
async function bubbleSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const n = array.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      bars[j].classList.add("highlight");
      bars[j + 1].classList.add("highlight");
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (array[j] > array[j + 1]) {
        bars[j].classList.add("swap");
        bars[j + 1].classList.add("swap");

        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        const tempHeight = bars[j].style.height;
        bars[j].style.height = bars[j + 1].style.height;
        bars[j].textContent = array[j];
        bars[j + 1].style.height = tempHeight;
        bars[j + 1].textContent = array[j + 1];

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      bars[j].classList.remove("highlight", "swap");
      bars[j + 1].classList.remove("highlight", "swap");
    }
  }

  visualizeArray(array);
}

// Insertion Sort implementation
async function insertionSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const n = array.length;

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = bars[j].style.height;
      bars[j + 1].textContent = array[j];
      j = j - 1;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key * 5}px`;
    bars[j + 1].textContent = key;
  }

  visualizeArray(array);
}

// QuickSort implementation
async function quickSort(array, low, high) {
  if (low < high) {
    const pi = await partition(array, low, high);
    await quickSort(array, low, pi - 1);
    await quickSort(array, pi + 1, high);
  }
  visualizeArray(array); // Visualize the array after sorting
}

async function partition(array, low, high) {
  const pivot = array[high];
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];

      const tempHeight = bars[i].style.height;
      bars[i].style.height = bars[j].style.height;
      bars[i].textContent = array[i];
      bars[j].style.height = tempHeight;
      bars[j].textContent = array[j];

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];

  const tempHeight = bars[i + 1].style.height;
  bars[i + 1].style.height = bars[high].style.height;
  bars[i + 1].textContent = array[i + 1];
  bars[high].style.height = tempHeight;
  bars[high].textContent = array[high];

  return i + 1;
}

// Merge Sort implementation
async function mergeSort(array) {
  if (array.length < 2) return array;

  const mid = Math.floor(array.length / 2);
  const left = array.slice(0, mid);
  const right = array.slice(mid);

  await mergeSort(left);
  await mergeSort(right);

  await merge(array, left, right);
  visualizeArray(array); // Visualize the array after sorting
}

async function merge(array, left, right) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  let i = 0;
  let j = 0;
  let k = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      array[k] = left[i];
      bars[k].style.height = `${left[i] * 5}px`;
      bars[k].textContent = left[i];
      i++;
    } else {
      array[k] = right[j];
      bars[k].style.height = `${right[j] * 5}px`;
      bars[k].textContent = right[j];
      j++;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    k++;
  }

  while (i < left.length) {
    array[k] = left[i];
    bars[k].style.height = `${left[i] * 5}px`;
    bars[k].textContent = left[i];
    await new Promise((resolve) => setTimeout(resolve, 500));
    i++;
    k++;
  }

  while (j < right.length) {
    array[k] = right[j];
    bars[k].style.height = `${right[j] * 5}px`;
    bars[k].textContent = right[j];
    await new Promise((resolve) => setTimeout(resolve, 500));
    j++;
    k++;
  }
}

// Heap Sort implementation
async function heapSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(array, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];

    const tempHeight = bars[0].style.height;
    bars[0].style.height = bars[i].style.height;
    bars[0].textContent = array[0];
    bars[i].style.height = tempHeight;
    bars[i].textContent = array[i];

    await heapify(array, i, 0);
  }

  visualizeArray(array);
}

async function heapify(array, n, i) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  let largest = i; // Initialize the largest as the root
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // If left child is larger than root
  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  // If right child is larger than the largest so far
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  // If the largest is not the root
  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];

    // Update the visualization
    const tempHeight = bars[i].style.height;
    bars[i].style.height = bars[largest].style.height;
    bars[i].textContent = array[i];
    bars[largest].style.height = tempHeight;
    bars[largest].textContent = array[largest];

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Recursively heapify the affected sub-tree
    await heapify(array, n, largest);
  }
}

// Radix Sort implementation
async function radixSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const max = Math.max(...array);
  let exp = 1; // Start with the least significant digit

  while (Math.floor(max / exp) > 0) {
    await countingSortByDigit(array, exp);
    exp *= 10;
  }

  visualizeArray(array);
}

async function countingSortByDigit(array, exp) {
  const n = array.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    const index = Math.floor(array[i] / exp) % 10;
    count[index]++;
  }

  // Update count array to hold actual position
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    const index = Math.floor(array[i] / exp) % 10;
    output[count[index] - 1] = array[i];
    count[index]--;
  }

  // Copy the output array back to the original array
  for (let i = 0; i < n; i++) {
    array[i] = output[i];
    const bar = bars[i];
    bar.style.height = `${array[i] * 5}px`;
    bar.textContent = array[i];
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

// Bucket Sort implementation
async function bucketSort(array) {
  const n = array.length;
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);

  if (n <= 1) return; // No sorting needed for an empty or single-element array

  const max = Math.max(...array);
  const bucketCount = Math.ceil(Math.sqrt(n));
  const buckets = Array.from({ length: bucketCount }, () => []);

  // Place array elements in buckets
  for (let i = 0; i < n; i++) {
    const index = Math.floor((array[i] / max) * (bucketCount - 1));
    buckets[index].push(array[i]);
  }

  // Sort each bucket and concatenate
  for (let i = 0; i < bucketCount; i++) {
    buckets[i].sort((a, b) => a - b);
    for (let j = 0; j < buckets[i].length; j++) {
      array[i * buckets[i].length + j] = buckets[i][j];
      const bar = bars[i * buckets[i].length + j];
      bar.style.height = `${array[i * buckets[i].length + j] * 5}px`;
      bar.textContent = array[i * buckets[i].length + j];
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  visualizeArray(array);
}

// Counting Sort implementation
async function countingSort(array) {
  const n = array.length;
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);

  const max = Math.max(...array);
  const count = new Array(max + 1).fill(0);
  const output = new Array(n);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[array[i]]++;
  }

  // Update the array with sorted values
  let index = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      output[index++] = i;
      count[i]--;
    }
  }

  // Update the original array and visualize it
  for (let i = 0; i < n; i++) {
    array[i] = output[i];
    const bar = bars[i];
    bar.style.height = `${array[i] * 5}px`;
    bar.textContent = array[i];
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  visualizeArray(array);
}
