// 1. Variables & Data Types

class Main1 {

    public static void main(String[] args) {

        // Integer data type
        int age = 25;

        // Decimal data type
        double salary = 50000.50;

        // Character data type
        char grade = 'A';

        // Boolean data type
        boolean isEmployee = true;

        // String (not a primitive data type)
        String name = "Rahul";

        // Long integer
        long population = 1400000000L;

        // Float decimal
        float percentage = 85.5f;

        // Short integer
        short year = 2026;

        // Byte integer
        byte marks = 100;

        // Print values
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Salary: " + salary);
        System.out.println("Grade: " + grade);
        System.out.println("Employee: " + isEmployee);
        System.out.println("Population: " + population);
        System.out.println("Percentage: " + percentage);
        System.out.println("Year: " + year);
        System.out.println("Marks: " + marks);
    }
}

// 2. Java Primitive Data Types

/*

| Data Type |          Size | Example             |
| --------- | ------------: | ------------------- |
| `byte`    |         8-bit | `byte x = 10;`      |
| `short`   |        16-bit | `short x = 100;`    |
| `int`     |        32-bit | `int x = 1000;`     |
| `long`    |        64-bit | `long x = 1000L;`   |
| `float`   |        32-bit | `float x = 10.5f;`  |
| `double`  |        64-bit | `double x = 10.5;`  |
| `char`    |        16-bit | `char x = 'A';`     |
| `boolean` | JVM-dependent | `boolean x = true;` |

*/

/* 3. Type Conversion

There are two important types:

A. Widening Conversion

Small data type → larger data type.

Automatically done by Java.
*/


class Main2 {

    public static void main(String[] args) {

        int number = 100;

        // int -> long
        long longNumber = number;

        // int -> double
        double decimalNumber = number;

        System.out.println(longNumber);
        System.out.println(decimalNumber);
    }
}


// byte → short → int → long → float → double



/* B. Narrowing Conversion

	Larger data type → smaller data type.

	You must explicitly cast it.

*/
	class Main3 {

		public static void main(String[] args) {

			double salary = 50000.75;

			int salaryInt = (int) salary;

			System.out.println("Double: " + salary); // Double: 50000.75
			System.out.println("Int: " + salaryInt); // Int: 50000
		}
	}



/*	4. String → int

	Very common in Java coding interviews.
*/
	class Main4 {

		public static void main(String[] args) {

			String str = "100";

			int number = Integer.parseInt(str);

			System.out.println(number + 50); // 150
		}
	}


	// 5. int → String
	
	class Main5 {

		public static void main(String[] args) {

			int number = 100;

			String str = String.valueOf(number);

			System.out.println(str);
		}
	}



	// 6. String → double
	
	class Main66 {
		public static void main(String[] args) {
			String price = "99.50";
			double value = Double.parseDouble(price);
			System.out.println(value);
		}
	}
	// 7. Complete Interview Example

	class Main7 {

		public static void main(String[] args) {

			// Variables
			int age = 25;
			double salary = 50000.50;
			char grade = 'A';
			boolean employee = true;
			String name = "Rahul";

			// Widening
			int number = 100;
			double convertedDouble = number;

			// Narrowing
			double price = 99.99;
			int convertedInt = (int) price;

			// String to int
			String strNumber = "200";
			int num = Integer.parseInt(strNumber);

			// int to String
			String str = String.valueOf(age);

			System.out.println("Name: " + name);
			System.out.println("Age: " + age);
			System.out.println("Salary: " + salary);
			System.out.println("Grade: " + grade);
			System.out.println("Employee: " + employee);

			System.out.println("Widening: " + convertedDouble);
			System.out.println("Narrowing: " + convertedInt);
			System.out.println("String to int: " + num);
			System.out.println("Int to String: " + str);
		}
	}




