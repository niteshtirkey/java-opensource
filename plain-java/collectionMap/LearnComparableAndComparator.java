package collectionMap;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;



class MyCustomDogComprator implements Comparator<Animal>{

    @Override
    public int compare(Animal o1, Animal o2) {
        return Integer.compare(o1.weight, o2.weight);
    }
    
}

public class LearnComparableAndComparator {
    public static void main(String[] args) {
        
        Animal a1 = new Animal(2, "monu", 22);
        Animal a2 = new Animal(3, "sonu", 23);
        Animal a3 = new Animal(3, "deno", 24);
        Animal a4 = new Animal(4, "annu", 21);

        List<Animal> dogs = new ArrayList<>();

        dogs.add(a1);
        dogs.add(a2);
        dogs.add(a3);
        dogs.add(a4);
        System.out.println(dogs);

        // Collections.sort(dogs, new MyCustomDogComprator());

        Collections.sort(dogs, (d1,d2)->{
            return Integer.compare(d1.weight, d2.weight); 
        });

        System.out.println(dogs);
    }
}
