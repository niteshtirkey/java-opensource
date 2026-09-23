package oops4;

public class LearningInterface {
    // Animal a1 = new Animal();
    public static void main(String[] args) {
        Monkey monkey = new Monkey();
        monkey.eats();
        monkey.sing();
    }
}
interface Pet{
    void sing();
}

interface Animal{
    void eats();

   default void drink(){
    System.out.println("animal is dinking");
    }
}

class Monkey implements Animal,Pet{

    @Override
    public void eats() {
        System.out.println("Monkey is eating.");
    }

    @Override
    public void sing() {
       System.out.println("Monkey is singing.");
    }
    
}