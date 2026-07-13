package com.deliveryboy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class DeliveryboyApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryboyApplication.class, args);
    }

}
