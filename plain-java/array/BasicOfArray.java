package array;

public class BasicOfArray {
    public static void main(String[] args){
		
		int age[] = new int[5];
		
		age[0] = 5;
		age[1] = 2;
		
		System.out.println(age[0]);
		System.out.println(age[1]);
		System.out.println(age[2]);
		
		int marks[] = {12,33,21,43,55};
		System.out.println(marks[3]);
		
		String names[] = {"Hari","Mukesh","Raja","Mahesh", "Rohan"};
		
		for(int i = 0; i < names.length; i++){
			System.out.println("Name is "+ names[i]);
		}
		
		for(String name : names){
			System.out.println("Each name "+ name);
		}
	}
}
