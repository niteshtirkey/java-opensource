/*	Java Operators & Binary Number System

	For Java interviews, you should understand operators first, then how Java stores integer values using the binary number system.

	1. What is an Operator?

	An operator is a symbol used to perform an operation on values or variables.

	Example:
*/

	int a = 10;
	int b = 5;

	int sum = a + b;

/*	Here + is an operator.

	2. Types of Java Operators

	Java operators are commonly divided into:

	1. Arithmetic Operators
	2. Relational Operators
	3. Logical Operators
	4. Assignment Operators
	5. Unary Operators
	6. Bitwise Operators
	7. Shift Operators
	8. Ternary Operator
	3. Arithmetic Operators

	Used for mathematical calculations.

	Operator	Meaning	Example
	+	Addition	10 + 5
	-	Subtraction	10 - 5
	*	Multiplication	10 * 5
	/	Division	10 / 5
	%	Modulus/Remainder	10 % 3
	Example
*/
	public class Main {
		public static void main(String[] args) {

			int a = 10;
			int b = 3;

			System.out.println(a + b); // 13
			System.out.println(a - b); // 7
			System.out.println(a * b); // 30
			System.out.println(a / b); // 3
			System.out.println(a % b); // 1
		}
	}

	System.out.println(10 / 3); // 3
	System.out.println(10.0 / 3); // 3.3333333333333335
/*	4. Relational Operators
	Used to compare two values.
	The result is always true or false.
	Operator	Meaning
	==	Equal
	!=	Not equal
	>	Greater than
	<	Less than
	>=	Greater than or equal
	<=	Less than or equal
	Example:
*/
	public class Main {
		public static void main(String[] args) {

			int age = 25;

			System.out.println(age == 25); // true
			System.out.println(age != 25); // false
			System.out.println(age > 18);  // true
			System.out.println(age < 18);  // false
			System.out.println(age >= 25); // true
			System.out.println(age <= 20); // false
		}
	}
/*	5. Logical Operators

	Used to combine multiple conditions.

	&& AND

	Both conditions must be true.
*/
	int age = 25;

	System.out.println(age >= 18 && age <= 60);// true

	true && true   = true
	true && false  = false
	false && true  = false
	false && false = false
//	|| OR

//	At least one condition must be true.

	int age = 25;

	System.out.println(age < 18 || age > 60); // false

//	Truth table:

	true  || true  = true
	true  || false = true
	false || true  = true
	false || false = false

	boolean isJavaEasy = true;

	System.out.println(!isJavaEasy);

	Output:

	false
//	6. Assignment Operators

	int x = 10;

//	= means assignment.

//	Java also provides compound assignment operators.

	int x = 10;

	x += 5;   // x = x + 5
	x -= 2;   // x = x - 2
	x *= 3;   // x = x * 3
	x /= 2;   // x = x / 2
	x %= 2;   // x = x % 2
	int x = 10;

	x += 5;

	System.out.println(x);

	//Increment ++
	int x = 10;

	x++;

	System.out.println(x);
	// Decrement --
	int x = 10;

	x--;

	System.out.println(x);

//	8. Pre-Increment vs Post-Increment

//	Post-increment
	int x = 10;

	System.out.println(x++);

//	Pre-increment
	int x = 10;

	System.out.println(++x);

//	9. Ternary Operator

	int age = 20;

	String result = age >= 18 ? "Adult" : "Minor";

	System.out.println(result);


	if (age >= 18) {
		System.out.println("Adult");
	} else {
		System.out.println("Minor");
	}