package exceptionHandling;

public class FinalyBlockInException {
    public static void main(String[] args) {
        int a[] = new int[5];

        // System.out.println("Hello world");

        // try{
        //     System.out.println(a[0]);
        // }catch(Exception e){
        //     System.out.println("All type exception");
        // }finally{
        //     System.out.println("I will always run");
        // }

        // System.out.println("Bye world");

        try{
        getNumberFromArray(a);
        }catch(Exception e){
            System.out.println("catch the exception"+e.getMessage());
        }
    }

    static int getNumberFromArray(int a[]) throws ArithmeticException{
        return a[9];
    }
}
