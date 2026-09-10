import java.util.Scanner;

public class userScanner{
	public static void main(String[] args){
		
		Scanner sc = new Scanner(System.in);
		
		System.out.println("Enter Employe Id: ");
		
		int id = sc.nextInt();
		
		sc.nextLine();
		
		System.out.println("Enter Employe name: ");
		String name = sc.nextLine();
		
		System.out.println("Enter Salary: ");
		double salary = sc.nextDouble();
		
		System.out.println("\nEmploye Details");
		System.out.println("id: "+ id);
		System.out.println("name: "+ name);
		System.out.println("Salary: "+ salary);
		sc.close();
		
	}
	
}
