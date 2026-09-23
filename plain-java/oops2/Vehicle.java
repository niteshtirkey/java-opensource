package oops2;

public class Vehicle {
    

    int wheelsCount;
    String modal;

    Vehicle(){
        System.out.println("Creating a vhicle instance.");
    }
    Vehicle(int wheelsCount){
        this.wheelsCount = wheelsCount;
        System.out.println("Creating vehicle with wheels");

    }
    void start(){
        System.out.println("Vehicle is starting.");
    }
}
