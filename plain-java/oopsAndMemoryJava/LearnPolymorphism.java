package oopsAndMemoryJava;

class Data {
    int data;

    public void printData() {
        System.out.println(data);
    }

    public void printData(int times) {
        for (int i = 0; i < times; i++) {
            System.out.println(times);
        }
    }
}

class ChildData extends Data {

    @Override
    public void printData() {
        System.out.println("Overhidded" + data);
    }

}

public class LearnPolymorphism {
    public static void main(String[] args) {

        Data d;
        d = new ChildData();
        d.printData(); // run time polyphormism asyncronous mthod overiding
        Data d2 = new Data();
        d2.printData(2); // compile time polyphormism aka mthod overloading
        // Integer a = 5;
        // Data obj = new Data();
        // obj.data = 3;
        // changeValue(a,obj);
        // System.out.println(obj.data);
        // System.out.println(a);
    }

    static void changeValue(int a, Data obj) {
        a = 20;
        obj.data = 100;
    }
}
