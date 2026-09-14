public class elseIfelse {
    public static void main(String[] args) {

        // you are giving three number, find the maximum number.

        int a = 14;
        int b = 18;
        int c = 1;
		int max = 0;
		
		max = a > b ? a > c ? a : c : b > c ? b : c;
		System.out.println(max);
      /*  if (a > b) {
            System.out.println("a is bigger then b");
            if (a > c) {
                System.out.println("a is bigger then c");
                System.out.println("a is largest " + a);
            } else {
                System.out.println("c is bigger then a");
                System.out.println("c is largest" + c);
            }
        } else {
            System.out.println("b is bigger then a");
            if (b > c) {
                System.out.println("b is bigger then c");
                System.out.println("b is largest " + b);
            } else {
                System.out.println("c is bigger then b");
                System.out.println("c is largest " + c);
            }
        }
		*/
    }
}
