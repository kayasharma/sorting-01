let currentArray = [];

function showElementsInput() {
  const numElements = document.getElementById("numElements").value;
  if (numElements > 0) {
    document.getElementById("elementsInput").style.display = "block";
    document.getElementById("sortButton").style.display = "block";
  }
}

function sortArray() {
  const elementsInput = document.getElementById("elementsInput").value;
  currentArray = elementsInput.split(",").map(Number);
  visualizeArray(currentArray);
  const algorithm = document.getElementById("sortingAlgorithm").value;
  let startTime, endTime;
  startTime = performance.now();

  switch (algorithm) {
    case "bubble":
      bubbleSort(currentArray);
      displayTimeComplexity("O(n^2)", "O(n^2)", "O(n)");
      break;
    case "insertion":
      insertionSort(currentArray);
      displayTimeComplexity("O(n^2)", "O(n^2)", "O(n)");
      break;
    case "quicksort":
      quickSort(currentArray, 0, currentArray.length - 1);
      displayTimeComplexity("O(n log n)", "O(n log n)", "O(n^2)");
      break;
    case "merge":
      mergeSort(currentArray);
      displayTimeComplexity("O(n log n)", "O(n log n)", "O(n log n)");
      break;
    case "heap":
      heapSort(currentArray);
      displayTimeComplexity("O(n log n)", "O(n log n)", "O(n log n)");
      break;
    case "radix":
      radixSort(currentArray);
      displayTimeComplexity("O(nk)", "O(nk)", "O(nk)");
      break;
    case "bucket":
      bucketSort(currentArray);
      displayTimeComplexity("O(n + k)", "O(n + k)", "O(n^2)");
      break;
    case "counting":
      countingSort(currentArray);
      displayTimeComplexity("O(n + k)", "O(n + k)", "O(n + k)");
      break;
    default:
      bubbleSort(currentArray);
      displayTimeComplexity("O(n^2)", "O(n^2)", "O(n)");
  }

  endTime = performance.now();
  displayActualTime((endTime - startTime).toFixed(2));
}

function displayTimeComplexity(best, average, worst) {
  const timeComplexityDiv = document.getElementById("timeComplexity");
  timeComplexityDiv.innerHTML = `
    <p>Time Complexity:</p>
    <ul>
      <li>Best Case: ${best}</li>
      <li>Average Case: ${average}</li>
      <li>Worst Case: ${worst}</li>
    </ul>
  `;
}

function displayActualTime(time) {
  const timeComplexityDiv = document.getElementById("timeComplexity");
  timeComplexityDiv.innerHTML += `<p>Actual Time Taken: ${time} milliseconds</p>`;
}

function resetArray() {
  visualizeArray(currentArray);
}

function visualizeArray(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  arrayContainer.innerHTML = "";
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bubble");
    bar.style.height = `${value * 5}px`;
    bar.textContent = value;
    arrayContainer.appendChild(bar);
  });
}

function compareAlgorithms() {
  console.log("Comparison of sorting algorithms is not yet implemented.");
}

document
  .getElementById("generateInputFields")
  .addEventListener("click", showElementsInput);
document.getElementById("sortButton").addEventListener("click", sortArray);
document.getElementById("resetButton").addEventListener("click", resetArray);
document
  .getElementById("compareButton")
  .addEventListener("click", compareAlgorithms);

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

async function insertionSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const n = array.length;

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      bars[j + 1].classList.add("highlight");
      await new Promise((resolve) => setTimeout(resolve, 500));

      array[j + 1] = array[j];
      bars[j + 1].style.height = bars[j].style.height;
      bars[j + 1].textContent = array[j];

      bars[j + 1].classList.remove("highlight");
      j = j - 1;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key * 5}px`;
    bars[j + 1].textContent = key;
  }

  visualizeArray(array);
}

async function quickSort(array, low, high) {
  if (low < high) {
    const pi = await partition(array, low, high);
    await quickSort(array, low, pi - 1);
    await quickSort(array, pi + 1, high);
  }
  visualizeArray(array);
}

async function partition(array, low, high) {
  const pivot = array[high];
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  let i = low - 1;

  for (let j = low; j < high; j++) {
    bars[j].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];

      const tempHeight = bars[i].style.height;
      bars[i].style.height = bars[j].style.height;
      bars[i].textContent = array[i];
      bars[j].style.height = tempHeight;
      bars[j].textContent = array[j];

      bars[j].classList.remove("highlight");
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

async function merge(array, left, right) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);

  if (bars.length !== array.length) {
    console.error(
      "Mismatch between array size and visual bars. Check visualization."
    );
    return;
  }

  let i = 0,
    j = 0,
    k = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      array[k] = left[i];
      if (bars[k]) {
        bars[k].style.height = `${left[i] * 5}px`;
        bars[k].textContent = left[i];
        bars[k].classList.add("highlight");
        await new Promise((resolve) => setTimeout(resolve, 200));
        bars[k].classList.remove("highlight");
      }
      i++;
    } else {
      array[k] = right[j];
      if (bars[k]) {
        bars[k].style.height = `${right[j] * 5}px`;
        bars[k].textContent = right[j];
        bars[k].classList.add("highlight");
        await new Promise((resolve) => setTimeout(resolve, 200));
        bars[k].classList.remove("highlight");
      }
      j++;
    }
    k++;
  }

  while (i < left.length) {
    array[k] = left[i];
    if (bars[k]) {
      bars[k].style.height = `${left[i] * 5}px`;
      bars[k].textContent = left[i];
      bars[k].classList.add("highlight");
      await new Promise((resolve) => setTimeout(resolve, 200));
      bars[k].classList.remove("highlight");
    }
    i++;
    k++;
  }

  while (j < right.length) {
    array[k] = right[j];
    if (bars[k]) {
      bars[k].style.height = `${right[j] * 5}px`;
      bars[k].textContent = right[j];
      bars[k].classList.add("highlight");
      await new Promise((resolve) => setTimeout(resolve, 200));
      bars[k].classList.remove("highlight");
    }
    j++;
    k++;
  }

  visualizeArray(array);
  return array;
}

async function heapSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(array, n, i, bars);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];

    const tempHeight = bars[0].style.height;
    bars[0].style.height = bars[i].style.height;
    bars[0].textContent = array[0];
    bars[i].style.height = tempHeight;
    bars[i].textContent = array[i];

    bars[i].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 200));
    bars[i].classList.remove("highlight");

    await heapify(array, i, 0, bars);
  }

  visualizeArray(array);
}

async function heapify(array, n, i, bars) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];

    const tempHeight = bars[i].style.height;
    bars[i].style.height = bars[largest].style.height;
    bars[i].textContent = array[i];
    bars[largest].style.height = tempHeight;
    bars[largest].textContent = array[largest];

    bars[i].classList.add("highlight");
    bars[largest].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 200));
    bars[i].classList.remove("highlight");
    bars[largest].classList.remove("highlight");

    await heapify(array, n, largest, bars);
  }
}

async function radixSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const max = Math.max(...array);
  const numDigits = Math.floor(Math.log10(max)) + 1;

  for (let i = 0; i < numDigits; i++) {
    const buckets = Array.from({ length: 10 }, () => []);
    for (let j = 0; j < array.length; j++) {
      const digit = Math.floor(array[j] / Math.pow(10, i)) % 10;
      buckets[digit].push(array[j]);
    }

    let k = 0;
    for (let j = 0; j < 10; j++) {
      for (let value of buckets[j]) {
        array[k] = value;
        bars[k].style.height = `${array[k] * 5}px`;
        bars[k].textContent = array[k];
        bars[k].classList.add("highlight");
        await new Promise((resolve) => setTimeout(resolve, 200));
        bars[k].classList.remove("highlight");
        k++;
      }
    }
  }

  visualizeArray(array);
}

async function bucketSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const numBuckets = Math.ceil(Math.sqrt(array.length));
  const min = Math.min(...array);
  const max = Math.max(...array);
  const bucketRange = (max - min) / numBuckets;

  const buckets = Array.from({ length: numBuckets }, () => []);

  for (let i = 0; i < array.length; i++) {
    const bucketIndex = Math.floor((array[i] - min) / bucketRange);
    if (bucketIndex >= numBuckets) {
      buckets[numBuckets - 1].push(array[i]);
    } else {
      buckets[bucketIndex].push(array[i]);
    }
  }

  let k = 0;
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i].length > 0) {
      await insertionSortInBucket(buckets[i], k, bars);
      for (let j = 0; j < buckets[i].length; j++) {
        array[k++] = buckets[i][j];
      }
    }
  }
  visualizeArray(array);
}

async function insertionSortInBucket(bucket, offset, bars) {
  const n = bucket.length;
  for (let i = 1; i < n; i++) {
    let key = bucket[i];
    let j = i - 1;

    while (j >= 0 && bucket[j] > key) {
      bucket[j + 1] = bucket[j];
      bars[offset + j + 1].style.height = `${bucket[j] * 5}px`;
      bars[offset + j + 1].textContent = bucket[j];
      bars[offset + j + 1].classList.add("highlight");
      await new Promise((resolve) => setTimeout(resolve, 200));
      bars[offset + j + 1].classList.remove("highlight");
      j = j - 1;
    }
    bucket[j + 1] = key;
    bars[offset + j + 1].style.height = `${key * 5}px`;
    bars[offset + j + 1].textContent = key;
    bars[offset + j + 1].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 200));
    bars[offset + j + 1].classList.remove("highlight");
  }
}

async function countingSort(array) {
  const arrayContainer = document.getElementById("arrayContainer");
  const bars = Array.from(arrayContainer.children);
  const max = Math.max(...array);
  const count = Array(max + 1).fill(0);

  for (let i = 0; i < array.length; i++) {
    count[array[i]]++;
  }

  let k = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      array[k++] = i;
      count[i]--;
    }
  }

  for (let k = 0; k < array.length; k++) {
    bars[k].style.height = `${array[k] * 5}px`;
    bars[k].textContent = array[k];
    bars[k].classList.add("highlight");
    await new Promise((resolve) => setTimeout(resolve, 200));
    bars[k].classList.remove("highlight");
  }

  visualizeArray(array);
}
