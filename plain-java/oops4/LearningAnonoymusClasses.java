package oops4;

public class LearningAnonoymusClasses {
    OuterClass obj = new OuterClass(){

        void sing(){

        }
    };
    SupperInterface obj2 = () -> {

    };
    public static void main(String[] args) {
        Walkable walkable = (int step) -> {
            System.out.println("step " + step);
            return step;
        };
        walkable.walks(3);
        Walkable obj = step -> 2*step; 
        System.out.println(obj.walks(3));
    }
}

interface Walkable{
    int walks(int step);
}

class OuterClass{
    public void outerMethod(){

    }
}



@FunctionalInterface 
interface SupperInterface{
    void interfaceMethod();
}