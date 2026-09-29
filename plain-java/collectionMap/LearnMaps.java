package collectionMap;

import java.util.*;

public class LearnMaps {
    public static void main(String[] args) {
        
        Map<String, String> map = new HashMap<>();

        map.put("US", "United State");
        map.put("IN", "India");
        map.putIfAbsent("IN", "indo");
        map.put("En", "India");
        

        // ArrayList<String> keys = new ArrayList<>(map.keySet());
        // System.out.println(keys);

        Set<Map.Entry<String, String>> entires = map.entrySet();
        for(Map.Entry<String,String> entry:entires){
            System.out.println(entry.getKey() +" "+ entry.getValue());
        }

        Collection<String> values = map.values();
        System.out.println(values);

        System.out.println(map);
        System.out.println(map.remove("US"));

        System.out.println(map.containsKey("In"));
        System.out.println("current value "+map.containsValue("India"));
        System.out.println(map);
        System.out.println(map.get("IN"));
    }
}
