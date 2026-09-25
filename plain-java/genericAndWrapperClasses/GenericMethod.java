package genericAndWrapperClasses;

public class GenericMethod {
    public static void main(String[] args) {
        printData("hello");
        GenericMethod obj = new GenericMethod();

        obj.doubleData(123);
    }
    static <T> void printData(T data){
        System.out.println(data);
    }
    <E> void doubleData(E data){
        System.out.println(data);
    }
}
