package com.codingShuttle;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name="payment.provider", havingValue = "razorpay")
public class RazorpayPaymentService implements PaymentService {

    public String pay() {
        String payment = "Razorpay Payment";
        System.out.println("Payment from: " + payment);
        return payment;
    }
}
