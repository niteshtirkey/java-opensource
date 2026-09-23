package oops4;

public class LearnAbstract {
    public static void main(String[] args){
        // Vehicle obj = new Vehicle();

        Car c1 = new Car();

        c1.accelerate();
        c1.brakes(2);
    }
}

abstract class Vehicle{
    abstract void accelerate();
    abstract int brakes(int wheels);
}

class Car extends Vehicle{

    @Override
    void accelerate() {
     System.out.println("Car is accelerating");
    }

    @Override
    int brakes(int wheels) {
        System.out.println("Car braking are pushed");
        return wheels;
    }
    
}