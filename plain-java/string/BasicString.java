public class BasicString {
    public static void main(String[] args) {

        String name = "Nitesh";
        String sameName = "Nitesh";

        String newName = new String("Nitesh");

        if (name == sameName) {
            System.out.println("Both are same name");
        }

        if (name == newName) {
            System.out.println("Bot are same name");
        } else {
            System.out.println("Both are not same name");
        }

        if (name.equals(newName)) {
            System.out.println("Name and newName have same values");
        } else {

            System.out.println("both are not same");
        }
    }
}
