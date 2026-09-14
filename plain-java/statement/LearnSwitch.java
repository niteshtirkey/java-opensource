
import java.util.Scanner;

public class LearnSwitch {
    public static void main(String[] args){
		
		Scanner sc = new Scanner(System.in);
		System.out.println("Enter the day");
		int day = sc.nextInt();
		
		switch(day){
			case 1:
				System.out.println("today is sunday");
				break;
			case 2:
				System.out.println("today is monday");
				break;
			case 3:
				System.out.println("today is tuesday");
				break;
			case 4:
				System.out.println("today is wednessday");
				break;
			case 5:
				System.out.println("today is thurstday");
				break;
			case 6:
				System.out.println("today is friday");
				break;
			case 7:
				System.out.println("today is sutarday");
				break;
				default:
				System.out.println("Invild Day");
		}
	}
}
