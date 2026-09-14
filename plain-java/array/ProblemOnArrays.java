package array;

public class ProblemOnArrays {
    public static void main(String[] args) {
        // 1. return number of sume
        // int numbers[] = {2,4,6,33,65,81,43,21};

        // int sum = 0;

        // for(int number: numbers){
        // sum += number;

        // }
        // System.out.println("Sum is "+sum);

        // 2. Min numner find
        // int numbers[] = { 2, 4, 6, 33, 65, 81, 43, 21 };

        // int min = Integer.MAX_VALUE;

        // for (int number : numbers) {
            // if (number < min) {
                // min = number;
            // }
            // ;

        // }
        // System.out.println("Min Num " + min);
		
		// 2. Multudimension array [2d array]
		
		// row -> student roll number
		// column -> subject position
		
		// int marks[][] = new int[4][3];
		
		int marks[][] = {
			{12,22,33},
			{13,23,34},
			{13,22,54},
			{32,31,44}
		};
		System.out.println(marks[2][1]);
		
		// marks[0][0] = 12;
		// marks[0][1] = 97;
		// marks[0][2] = 33;
		
		// marks[1][0] = 13;
		// marks[1][1] = 32;
		// marks[1][2] = 87;
		
		// marks[2][0] = 12;
		// marks[2][1] = 97;
		// marks[2][2] = 33;
		
		// marks[3][0] = 13;
		// marks[3][1] = 32;
		// marks[3][2] = 87;
		
    }
}