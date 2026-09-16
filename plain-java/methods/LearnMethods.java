package methods;

public class LearnMethods {
	public static void main(String[] args){
        // System.out.println("1");
		// greet();
        // System.out.println("2");
		int averageFromOuterFunc = average(7,3,false);
        System.out.println("Hello");
		double averageDouble = averageFromOuterFunc * 3;
       System.out.println(averageDouble);
	}
	
	public static void greet(){
		System.out.println("Hello World");
	}
	
	public static int average(int a, int b, boolean shouldAverage){
		if(shouldAverage == false){
			return -1;
		}
		int avg = (a+b)/2;
		System.out.println("The average is "+ avg);
		return avg;
	}

	static int mininum(int a,int b){
		return a < b ? a:b;
	}
}

