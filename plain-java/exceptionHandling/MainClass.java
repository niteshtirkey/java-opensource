package exceptionHandling;

public class MainClass {
    public static void main(String[] args) {
        // int a[] = new int[5];

        // System.out.println("Hello guys");
        // try {
        //     int result = 4 / 0;
        //     System.out.println(a[22]);
        // } catch (ArrayIndexOutOfBoundsException e) {
        //     System.out.println("Tried to access the out of bound element");
        // } catch (ArithmeticException e) {
        //     System.out.println(e.getStackTrace());
        //     System.out.println(e.getMessage());
        //     System.out.println(e);
        // }

        // System.out.println("Bye guys");

         int a[] = new int[5];

        System.out.println("Hello guys");
        try {
            int result = 4 / 0;
            System.out.println(a[22]);
        } 
        // catch (ArrayIndexOutOfBoundsException | ArithmeticException e) {
        //     System.out.println("handling the exceptional");
        // } 
        catch(Exception e){
            System.out.println("all exception handled");
        }
        System.out.println("Bye guys");

    }
}
