async function compareAlgorithms() {
  const selectedAlgorithms = getSelectedAlgorithms();
  if (selectedAlgorithms.length === 0) {
    alert("Please select at least one sorting algorithm.");
    return;
  }
  const times = [];
  for (let algorithm of selectedAlgorithms) {
    const arrayCopy = [...currentArray];
    let startTime = performance.now();
    switch (algorithm) {
      case "bubble":
        await bubbleSort(arrayCopy, algorithm);
        break;
      case "insertion":
        await insertionSort(arrayCopy, algorithm);
        break;
      case "quicksort":
        await quickSort(arrayCopy, 0, arrayCopy.length - 1, algorithm);
        break;
      case "merge":
        await mergeSort(arrayCopy, algorithm);
        break;
      case "heap":
        await heapSort(arrayCopy, algorithm);
        break;
      case "radix":
        await radixSort(arrayCopy, algorithm);
        break;
      case "bucket":
        await bucketSort(arrayCopy, algorithm);
        break;
      case "counting":
        await countingSort(arrayCopy, algorithm);
        break;
    }
    let endTime = performance.now();
    times.push({ algorithm, time: (endTime - startTime).toFixed(2) });
  }
  displayComparisonChart(times);
  highlightFastestAlgorithm(times);
}

function highlightFastestAlgorithm(times) {
  const fastest = times.reduce((min, t) => (t.time < min.time ? t : min), times[0]);
  const timeComplexityDiv = document.getElementById("timeComplexity");
  timeComplexityDiv.innerHTML += `<p>Fastest Algorithm: <strong>${fastest.algorithm}</strong> with ${fastest.time} milliseconds</p>`;
}
