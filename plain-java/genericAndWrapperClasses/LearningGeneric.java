package genericAndWrapperClasses;

public class LearningGeneric {
    public static void main(String[] args) {
        Dog<String,Integer> d1 = new Dog<>("233e",123);
        Dog<Integer, String> d2 = new Dog<>(123, "hello");

        System.out.println(d2.getId());
    }
}

class Dog<E, T>{
    E id;
    T name;
    public Dog(E id, T name){
        this.id = id;
        this.name = name;
    }

    E getId(){
        return id;
    }
}