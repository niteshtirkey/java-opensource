package collectionAndList;

import java.util.ArrayList;
import java.util.List;

public class LearnLists {
    public static void main(String[] args) {

        List<Integer> list = new ArrayList<>();
        // List<Integer> list2 = new ArrayList<>();

        list.add(20);
        list.add(30);
        list.add(1);

        System.out.println(list);
        System.out.println(list.get(1));
        list.set(2,40);

        System.out.println(list.indexOf(40));
        System.out.println(list);
        // list2.add(1);
        // list2.add(2);
        // list2.add(2);
        // list.addAll(list2);

        // list.removeAll(list2);
        // list.retainAll(list2);

        // System.out.println(list);
        // System.out.println(list.size());
        // System.out.println(list.contains(20));
        // list.remove(Integer.valueOf(20));


        // Object a[] = list.toArray();

        // for(Object e:a){
        //     Integer temp = (Integer) e;
        //     System.out.println(e);
        // }

        // System.out.println(list);


    }
}
