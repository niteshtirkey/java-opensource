package genericAndWrapperClasses;

public class WrapperClasses {
    public static void main(String[] args) {

        Integer obj1 = new Integer(12);

        Integer obj2 = Integer.valueOf("12");

        System.out.println(obj2 * 4);
        
        Integer obj3 = 12; // autoboxing
        int age = obj1; // unboxing
    }
}
