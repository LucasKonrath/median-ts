let maxHeap: number[] = [];
let minHeap: number[] = [];
let delayedRemoval: Map<number, number> = new Map();
let maxHeapSize: number = 0;
let minHeapSize: number = 0;
let windowSize: number = 0;

function pushMaxHeap(num: number): void {
    maxHeap.push(num);
    let childIndex = maxHeap.length - 1;
    while (childIndex > 0) {
        const parentIndex = Math.floor((childIndex - 1) / 2);
        if (maxHeap[parentIndex] >= maxHeap[childIndex]) break;
        [maxHeap[parentIndex], maxHeap[childIndex]] = [maxHeap[childIndex], maxHeap[parentIndex]];
        childIndex = parentIndex;
    }
}

function pushMinHeap(num: number): void {
    minHeap.push(num);
    let childIndex = minHeap.length - 1;
    while (childIndex > 0) {
        const parentIndex = Math.floor((childIndex - 1) / 2);
        if (minHeap[parentIndex] <= minHeap[childIndex]) break;
        [minHeap[parentIndex], minHeap[childIndex]] = [minHeap[childIndex], minHeap[parentIndex]];
        childIndex = parentIndex;
    }
}

function popMaxHeap(): void {
    if (maxHeap.length === 0) return;
    maxHeap[0] = maxHeap[maxHeap.length - 1];
    maxHeap.pop();
    if (maxHeap.length === 0) return;
  
    let parentIndex = 0;
    while (true) {
        let largest = parentIndex;
        const leftChild = 2 * parentIndex + 1;
        const rightChild = 2 * parentIndex + 2;
      
        if (leftChild < maxHeap.length && maxHeap[leftChild] > maxHeap[largest]) {
            largest = leftChild;
        }
        if (rightChild < maxHeap.length && maxHeap[rightChild] > maxHeap[largest]) {
            largest = rightChild;
        }
        if (largest === parentIndex) break;
      
        [maxHeap[parentIndex], maxHeap[largest]] = [maxHeap[largest], maxHeap[parentIndex]];
        parentIndex = largest;
    }
}

function popMinHeap(): void {
    if (minHeap.length === 0) return;
    minHeap[0] = minHeap[minHeap.length - 1];
    minHeap.pop();
    if (minHeap.length === 0) return;
  
    let parentIndex = 0;
    while (true) {
        let smallest = parentIndex;
        const leftChild = 2 * parentIndex + 1;
        const rightChild = 2 * parentIndex + 2;
      
        if (leftChild < minHeap.length && minHeap[leftChild] < minHeap[smallest]) {
            smallest = leftChild;
        }
        if (rightChild < minHeap.length && minHeap[rightChild] < minHeap[smallest]) {
            smallest = rightChild;
        }
        if (smallest === parentIndex) break;
      
        [minHeap[parentIndex], minHeap[smallest]] = [minHeap[smallest], minHeap[parentIndex]];
        parentIndex = smallest;
    }
}

function initializeMedianFinder(k: number): void {
    windowSize = k;
    maxHeap = [];
    minHeap = [];
    delayedRemoval = new Map();
    maxHeapSize = 0;
    minHeapSize = 0;
}

function pruneMaxHeap(): void {
    while (maxHeap.length > 0 && delayedRemoval.has(maxHeap[0]) && delayedRemoval.get(maxHeap[0])! > 0) {
        const topValue = maxHeap[0];
        const count = delayedRemoval.get(topValue)!;
        if (count === 1) {
            delayedRemoval.delete(topValue);
        } else {
            delayedRemoval.set(topValue, count - 1);
        }
        popMaxHeap();
    }
}

function pruneMinHeap(): void {
    while (minHeap.length > 0 && delayedRemoval.has(minHeap[0]) && delayedRemoval.get(minHeap[0])! > 0) {
        const topValue = minHeap[0];
        const count = delayedRemoval.get(topValue)!;
        if (count === 1) {
            delayedRemoval.delete(topValue);
        } else {
            delayedRemoval.set(topValue, count - 1);
        }
        popMinHeap();
    }
}

function rebalance(): void {
    if (maxHeapSize > minHeapSize + 1) {
        pushMinHeap(maxHeap[0]);
        popMaxHeap();
        maxHeapSize--;
        minHeapSize++;
        pruneMaxHeap();
    } 
    else if (maxHeapSize < minHeapSize) {
        pushMaxHeap(minHeap[0]);
        popMinHeap();
        maxHeapSize++;
        minHeapSize--;
        pruneMinHeap();
    }
}

function addNum(num: number): void {
    if (maxHeap.length === 0 || num <= maxHeap[0]) {
        pushMaxHeap(num);
        maxHeapSize++;
    } else {
        pushMinHeap(num);
        minHeapSize++;
    }
    rebalance();
}

function removeNum(num: number): void {
    delayedRemoval.set(num, (delayedRemoval.get(num) || 0) + 1);
  
    if (num <= maxHeap[0]) {
        maxHeapSize--;
        if (num === maxHeap[0]) {
            pruneMaxHeap();
        }
    } else {
        minHeapSize--;
        if (num === minHeap[0]) {
            pruneMinHeap();
        }
    }
    rebalance();
}

function findMedian(): number {
    return (windowSize & 1) ? maxHeap[0] : (maxHeap[0] + minHeap[0]) / 2.0;
}

function medianSlidingWindow(nums: number[], k: number): number[] {
    initializeMedianFinder(k);
  
    for (let i = 0; i < k; i++) {
        addNum(nums[i]);
    }
  
    const result: number[] = [findMedian()];
  
    for (let i = k; i < nums.length; i++) {
        addNum(nums[i]);
        removeNum(nums[i - k]);
        result.push(findMedian());
    }
  
    return result;
}