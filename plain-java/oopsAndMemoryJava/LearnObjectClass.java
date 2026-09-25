package oopsAndMemoryJava;

class Car {
    String modal;
    int year;

    public Car(String modal, int year) {
        this.modal = modal;
        this.year = year;
    }

    public boolean equals(Object obj) {
        Car that = (Car) obj;
        if (this.modal.equals(that.modal) && this.year == that.year) {
            return true;
        }
        return false;
    }

    @Override
    public int hashCode() {
        int initialNumber = 31;
        initialNumber += year;
        initialNumber += modal.hashCode();
        return initialNumber;
    }

    // public String toString(){
    // return "Car ka modal "+ modal + " and year is "+ year;
    // }
}

public class LearnObjectClass {
    public static void main(String[] args) {
        Car obj = new Car("Honda", 2020);
        Car obj1 = new Car("Honda", 2020);
        System.out.println(obj.equals(obj1));
        System.out.println(obj.toString());
        System.out.println(obj.hashCode());
        System.out.println(obj1.hashCode());
    }

}
