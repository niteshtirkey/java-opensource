package collectionAndList;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Stack;

public class ListMore {
    public static void main(String[] args) {
        
        List<String> fruits = new ArrayList<>();

        fruits.add("Mango");
        fruits.add("banana");
        fruits.add("Orange");
        fruits.add("Lichi");

        Stack<String> fStack = new Stack<>();

        fStack.push("A");
        fStack.push("B");
        fStack.push("D");
        fStack.push("E");
        fStack.push("F");

        System.out.println(fStack);
        System.out.println(fStack.pop());
        System.out.println(fStack);
        

        

        for(int i = 0; i < fruits.size(); i++){
            System.out.println("Fruits is "+fruits.get(i));
        }

        for(String fruit: fruits){
            System.out.println("Fruit is "+ fruit);
        }
        
        Iterator<String> fe = fruits.iterator();
        while (fe.hasNext()) {
            System.out.println("Iterator "+ fe.next());
        }

        List<String> samllList =  fruits.subList(1,3);
        System.out.println(samllList);
    }
}
