let currentArray = [];
const socket = io.connect(window.location.origin);

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
  visualizeArray(currentArray, "arrayContainer", "Original Array:");
}

function visualizeArray(
  array,
  containerId = "arrayContainer",
  title = "Original Array:"
) {
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }
  container.innerHTML = `<h3>${title}</h3>`;
  const arrayContainer = document.createElement("div");
  arrayContainer.style.display = "flex";
  arrayContainer.style.flexDirection = "row";
  container.appendChild(arrayContainer);
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bubble");
    bar.style.height = `${value * 5}px`;
    bar.textContent = value;
    arrayContainer.appendChild(bar);
  });
}

// Listen for array updates from the backend
socket.on("array update", (data) => {
  const { array, algorithm } = data;
  if (algorithm) {
    const containerId = `sortedArrayContainer-${algorithm}`;
    visualizeArray(array, containerId, `${algorithm} - Sorting`);
  } else {
    visualizeArray(array);
  }
});

async function runAlgorithm(algorithm, array) {
  const response = await fetch("/sort", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ array, algorithm }),
  });
  const data = await response.json();
  const sortedArray = data.sortedArray;
  const containerId = `sortedArrayContainer-${algorithm}`;
  visualizeArray(sortedArray, containerId, `${algorithm} Sorted Array:`);
}

async function compareAlgorithms() {
  const selectedAlgorithms = getSelectedAlgorithms();
  if (selectedAlgorithms.length === 0) {
    alert("Please select at least one sorting algorithm.");
    return;
  }
  const times = [];
  for (let algorithm of selectedAlgorithms) {
    const arrayCopy = [...currentArray];
    const startTime = performance.now();
    await runAlgorithm(algorithm, arrayCopy);
    const endTime = performance.now();
    times.push({ algorithm, time: (endTime - startTime).toFixed(2) });
  }
  displayComparisonChart(times);
  highlightFastestAlgorithm(times);
}

document
  .getElementById("generateInputFields")
  .addEventListener("click", showElementsInput);
document.getElementById("sortButton").addEventListener("click", async () => {
  sortArray();
  const selectedAlgorithms = getSelectedAlgorithms();
  if (selectedAlgorithms.length === 0) {
    alert("Please select at least one sorting algorithm.");
    return;
  }
  for (let algorithm of selectedAlgorithms) {
    const arrayCopy = [...currentArray];
    await runAlgorithm(algorithm, arrayCopy);
  }
});
document.getElementById("compareButton").addEventListener("click", async () => {
  sortArray();
  await compareAlgorithms();
});
document.getElementById("resetButton").addEventListener("click", resetArray);

function resetArray() {
  currentArray = [];
  document.getElementById("elementsInput").value = "";
  document.getElementById("elementsInput").style.display = "none";
  document.getElementById("sortButton").style.display = "none";
  document.getElementById("arrayContainer").innerHTML = "";
  document.getElementById("timeComplexity").innerHTML = "";
  document.getElementById("chartContainer").innerHTML = "";
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => (checkbox.checked = false));
}

function getSelectedAlgorithms() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  return Array.from(checkboxes).map((checkbox) => checkbox.value);
}

function displayTimeComplexity(algorithm) {
  let best, average, worst;

  switch (algorithm) {
    case "bubble":
      best = "O(n)";
      average = "O(n^2)";
      worst = "O(n^2)";
      break;
    case "insertion":
      best = "O(n)";
      average = "O(n^2)";
      worst = "O(n^2)";
      break;
    case "quicksort":
      best = "O(n log n)";
      average = "O(n log n)";
      worst = "O(n^2)";
      break;
    case "merge":
      best = "O(n log n)";
      average = "O(n log n)";
      worst = "O(n log n)";
      break;
    case "heap":
      best = "O(n log n)";
      average = "O(n log n)";
      worst = "O(n log n)";
      break;
    case "radix":
      best = "O(nk)";
      average = "O(nk)";
      worst = "O(nk)";
      break;
    case "bucket":
      best = "O(n + k)";
      average = "O(n + k)";
      worst = "O(n^2)";
      break;
    case "counting":
      best = "O(n + k)";
      average = "O(n + k)";
      worst = "O(n + k)";
      break;
    default:
      best = "Unknown";
      average = "Unknown";
      worst = "Unknown";
  }

  const timeComplexityDiv = document.getElementById("timeComplexity");
  timeComplexityDiv.innerHTML = `
    <p>Time Complexity for ${
      algorithm.charAt(0).toUpperCase() + algorithm.slice(1)
    } Sort:</p>
    <ul>
      <li>Best Case: ${best}</li>
      <li>Average Case: ${average}</li>
      <li>Worst Case: ${worst}</li>
    </ul>
  `;
}

function highlightFastestAlgorithm(times) {
  const fastest = times.reduce(
    (min, t) => (t.time < min.time ? t : min),
    times[0]
  );
  const timeComplexityDiv = document.getElementById("timeComplexity");
  timeComplexityDiv.innerHTML = "";

  times.forEach((t) => {
    const color = t.algorithm === fastest.algorithm ? "limegreen" : "initial";
    timeComplexityDiv.innerHTML += `<p style="color: ${color};">${t.algorithm} - Time Taken: <strong>${t.time}</strong> milliseconds</p>`;
  });

  timeComplexityDiv.innerHTML += `<p><strong>Fastest Algorithm: ${fastest.algorithm}</strong> with ${fastest.time} milliseconds</p>`;
}

function displayActualTime(time, algorithm) {
  const timeComplexityDiv = document.getElementById("timeComplexity");
  timeComplexityDiv.innerHTML += `<p>${algorithm} - Actual Time Taken: ${time} milliseconds</p>`;
}

function displayComparisonChart(times) {
  const chartContainer = document.getElementById("chartContainer");
  chartContainer.innerHTML = '<canvas id="comparisonChart"></canvas>';
  const ctx = document.getElementById("comparisonChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: times.map((t) => t.algorithm),
      datasets: [
        {
          label: "Time Taken (ms)",
          data: times.map((t) => t.time),
          backgroundColor: times.map((t) =>
            t.algorithm ===
            times.reduce((min, t) => (t.time < min.time ? t : min), times[0])
              .algorithm
              ? "limegreen"
              : "rgba(75, 192, 192, 0.2)"
          ),
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
