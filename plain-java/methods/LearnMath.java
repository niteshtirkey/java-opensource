package methods;

public class LearnMath {
  public static void main(String[] args) {
    int a = 3;
    int b = 4;
    
    System.out.println(Math.min(a, b));
    System.out.println(getRandomNumber(100, 200));
    System.out.println(Math.sqrt(16));
    System.out.println(Math.pow(3, 4));
    System.out.println(Math.abs(-4));
    System.out.println(Math.floor(53.2));
    System.out.println(Math.ceil(2.3));
    System.out.println(Math.round(2.2));
  }

  public static int getRandomNumber(int a, int b) {
    return (int) (Math.random() * (b - a + 1) + a);
  }

}
