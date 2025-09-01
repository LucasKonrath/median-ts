import java.util.*;

public class SlidingWindowMedian {
    private PriorityQueue<Integer> maxHeap;
    private PriorityQueue<Integer> minHeap;

    public List<Double> medianSlidingWindow(int[] nums, int k) {
        List<Double> result = new ArrayList<>();
        maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        minHeap = new PriorityQueue<>();

        for (int i = 0; i < nums.length; i++) {
            addNum(nums[i]);
            if (i >= k - 1) {
                result.add(getMedian());
                removeNum(nums[i - k + 1]);
            }
        }
        return result;
    }

    private void addNum(int num) {
        maxHeap.offer(num);
        minHeap.offer(maxHeap.poll());
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    private void removeNum(int num) {
        if (num <= maxHeap.peek()) {
            maxHeap.remove(num);
        } else {
            minHeap.remove(num);
        }
        // Rebalance
        if (maxHeap.size() < minHeap.size()) {
            maxHeap.offer(minHeap.poll());
        } else if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.offer(maxHeap.poll());
        }
    }

    private double getMedian() {
        if (maxHeap.size() == minHeap.size()) {
            return ((double)maxHeap.peek() + (double)minHeap.peek()) / 2.0;
        } else {
            return (double)maxHeap.peek();
        }
    }
}
