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
  const metrics = data.metrics;
  displayTimeComplexity(algorithm, metrics);
  const containerId = `sortedArrayContainer-${algorithm}`;
  visualizeArray(sortedArray, containerId, `${algorithm} Sorted Array:`);
  return metrics;
}

async function compareAlgorithms() {
  const selectedAlgorithms = getSelectedAlgorithms();
  if (selectedAlgorithms.length === 0) {
    alert("Please select at least one sorting algorithm.");
    return;
  }
  const metricsList = [];
  for (let algorithm of selectedAlgorithms) {
    const arrayCopy = [...currentArray];
    const metrics = await runAlgorithm(algorithm, arrayCopy);
    metricsList.push({ algorithm, ...metrics });
  }
  displayMetricsComparison(metricsList);
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

function displayTimeComplexity(algorithm, metrics) {
  const timeComplexityDiv = document.getElementById("timeComplexity");
  timeComplexityDiv.innerHTML += `
    <p>${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort:</p>
    <ul>
      <li>Comparisons: ${metrics.comparisons}</li>
      <li>Swaps: ${metrics.swaps}</li>
    </ul>
  `;
}

function displayMetricsComparison(metricsList) {
  const fastest = metricsList.reduce(
    (min, m) => (m.comparisons < min.comparisons ? m : min),
    metricsList[0]
  );
  const timeComplexityDiv = document.getElementById("timeComplexity");
  timeComplexityDiv.innerHTML = "";

  metricsList.forEach((m) => {
    const color = m.algorithm === fastest.algorithm ? "limegreen" : "initial";
    timeComplexityDiv.innerHTML += `<p style="color: ${color};">${m.algorithm} - Comparisons: <strong>${m.comparisons}</strong>, Swaps: <strong>${m.swaps}</strong></p>`;
  });

  timeComplexityDiv.innerHTML += `<p><strong>Fastest Algorithm: ${fastest.algorithm}</strong> with ${fastest.comparisons} comparisons</p>`;

  displayComparisonChart(metricsList);
}

function displayComparisonChart(metricsList) {
  const chartContainer = document.getElementById("chartContainer");
  chartContainer.innerHTML = '<canvas id="comparisonChart"></canvas>';
  const ctx = document.getElementById("comparisonChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: metricsList.map((m) => m.algorithm),
      datasets: [
        {
          label: "Comparisons",
          data: metricsList.map((m) => m.comparisons),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Swaps",
          data: metricsList.map((m) => m.swaps),
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
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
