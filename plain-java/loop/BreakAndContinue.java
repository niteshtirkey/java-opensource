
public class BreakAndContinue {
    public static void main(String[] args) {

        // for(int i=0; i<=20; i += 2){
        // System.out.println(i);
        // if(i>=10) break;
        // }

        // int i = 0;

        // while (i <= 5) {
        // System.out.println(i);
        // i++;
        // if (i == 3)
        // break;
        // }

        // for(int i=0; i <= 20; i++){
        // if(i == 2 || i == 8 || i >= 15) continue;
        // System.out.println("gave toffee to " +i);
        // }

        // nested loop

        // for(int count = 0; count < 10; count++){
        // for(int i = 0; i < 6; i++){
        // System.out.print(i+" ");
        // }
        // System.out.println("printed"+count);
        // }

        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < i; j++) {
                System.out.print(j + " ");
            }
            System.out.println();
        }
		
		for(int i = 0; i < 10; i++){
			int j = 0;
			while(j < i){
				System.out.print("*");
				j++;
			}
			System.out.println();
		}

    }

}
