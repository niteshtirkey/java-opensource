package collectionQueueAndSet;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

class Student{
    int rollNo;

    String name;

    public Student(int rollNo, String name){
        this.rollNo = rollNo;
        this.name = name;
    }
    @Override 
    public String toString(){
        return "Student name "+ name + " and rollno "+ rollNo;
    }
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + rollNo;
        return result;
    }
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Student other = (Student) obj;
        if (rollNo != other.rollNo)
            return false;
        return true;
    }
    
}

public class LearnSet {
    public static void main(String[] args) {
        // Set<Integer> set = new HashSet<>();
        // Set<Integer> set = new LinkedHashSet<>();

        Set<Student> std = new HashSet<>();

        std.add(new Student(1, "nitesh"));
        std.add(new Student(1, "nitesh"));
        std.add(new Student(1, "nitesh"));
        std.add(new Student(1, "nitesh"));

        System.out.println(std);

        Set<Integer> set = new TreeSet<>();

        set.add(10);
        set.add(30);
        set.add(40);
        set.add(40);
        set.add(20);

        System.out.println(set);
        set.remove(10);
        System.out.println(set);

        Set<String> hSet = new HashSet<>();
        hSet.add("Mukesh");
        hSet.add("Vishal");
        hSet.add("Rakesh");
        hSet.add("Mukesh");

        System.out.println(hSet);
    }
}
