package com.codingShuttle;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "payment.provider", havingValue = "strip")
public class StripPaymentService implements PaymentService {

    @Override
    public String pay() {
        String payment = "String Payment";
        System.out.println("Paying form: " + payment);
        return payment;
    }
}
