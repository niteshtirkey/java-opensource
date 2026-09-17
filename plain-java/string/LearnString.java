import java.util.Scanner;

public class LearnString {
    public static void main(String[] args){
        // Scanner sc = new Scanner(System.in);

        // System.out.println("Enter your first name: ");
        // String firstName = sc.nextLine();

        // System.out.println("Enter your last name: ");
        // String lastName = sc.nextLine();

        // System.out.println("Fullname is "+ firstName + " " + lastName);
        // sc.close();

        // char temp = "Carpet".charAt(3);
        // System.out.println(temp);

        // int age = 123;
        // String StringAge = String.valueOf(age);
        // System.out.println(StringAge);

        String sentance = "I love java, java is good language";
       
        // String words[] = sentance.split(",");
        char words[] = sentance.toCharArray();
        for(char word: words){
            System.out.println(word);
        }
    }
}
