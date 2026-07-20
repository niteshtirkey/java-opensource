package com.codingShuttle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CodingShuttleApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(CodingShuttleApplication.class, args);
    }

    //    @Autowired
    private final PaymentService paymentService;

    public CodingShuttleApplication(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Override
    public void run(String... args) throws Exception {
        String payment = paymentService.pay();
        System.out.println("Payment Done:" + payment);
    }
}
