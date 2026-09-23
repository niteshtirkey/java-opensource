package oops3.learnPackage;

public class Persion {
    int age;
    String name;
    boolean canBeChanged = true;

    public void setAge(int age) {
        if (canBeChanged) {
            if (age > 0) {
                this.age = age;
            }
        }
    }

    public int getAge() {
        if (canBeChanged)
            return age;
        return -1;
    }
}
