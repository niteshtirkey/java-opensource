package collectionQueueAndSet;

import java.util.ArrayDeque;

public class LearnDeque {
    public static void main(String[] args) {
        ArrayDeque<Integer> dq = new ArrayDeque<>();

        dq.offer(20);
        dq.offerFirst(30);
        dq.offerLast(40);
        System.out.println(dq);

        System.out.println(dq.pollFirst());
        System.out.println(dq.poll());

        System.out.println(dq);
    }
}
