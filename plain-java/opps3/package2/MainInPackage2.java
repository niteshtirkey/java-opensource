package opps3.package2;

import opps3.learnPackage.Teacher;

public class MainInPackage2 extends Teacher{
    public static void main(String[] args) {
        Teacher obj = new Teacher();

        MainInPackage2 obj2 = new MainInPackage2();
        obj2.studentCount = 21;
    }
}
