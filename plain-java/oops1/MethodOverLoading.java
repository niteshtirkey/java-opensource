package oops1;

public class MethodOverLoading {
    public static void main(String[] args) {
        Greet obj = new Greet();
        obj.greetings();
        obj.greetings("Nitesh");
        obj.greetings("mukesh",5);
    }
}

class Greet {
    void greetings() {
        System.out.println("Helllo, good morning");
    }

    void greetings(String name) {
        System.out.println("Hello " + name + " good moring");
    }

    void greetings(String name, int count) {
        for (int i = 0; i < count; i++) {
            System.out.println("Hello " + name + " How are you?");
        }

    }
}