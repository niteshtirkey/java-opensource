package oops2;

public class Car extends Vehicle{

    String color;

    void start(){
        super.start();
        System.out.println(this);
        System.out.println(this.modal+" Car is startiting.");
    }
    Car braking(){
        return this;
    }
    Car(){
        super(2);
        System.out.println("Car is being created.");
    }
    public static void main(String[] args){
        Car obj = new Car();
        obj.wheelsCount = 4;
        obj.modal = "Nexon";
        obj.start();
        obj.color = "Red";
    }
}

class Scooter{
    void braking(Car car){
        System.out.println(car.modal+" is braking");
    }
}