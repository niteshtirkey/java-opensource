
public class ifElse {
    public static void main(String[] args) {
        // int age = 4;
        // if (age >= 18) {
        //     System.out.println("You can vote.");
        // }else{
        //     System.out.println("You can not vote");
        // }

        int day = 1;
        if(day == 2){
            System.out.println("Go to home.");
        }else if(day == 3){
            System.out.println("go to party");
        }else if(day == 1){
            System.out.println("go to Church");
        }else{
			System.out.println("go to office");
		}
		
		// Logical operator in condition
		
		
		int time = 18;
		
		if(time >= 10 && time <=20){
			System.out.println("office is open");
		}else{
			System.out.println("office is closed");
		}
		
		if(time == 12 || time == 18){
			System.out.println("Time for snacks");
		}else{
			System.out.println("Time for work");
		}
		
    }
}
