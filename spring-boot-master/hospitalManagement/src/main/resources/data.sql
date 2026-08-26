INSERT INTO patient (name, gender, birth_date, email, blood_group, created_date)
VALUES ('Aarav Sharma', 'MALE', '1990-05-10', 'aarav.sharma@example.com', 'O_POSITIVE', CURRENT_TIMESTAMP),
       ('Diya Patel', 'FEMALE', '1995-08-20', 'diya.patel@example.com', 'A_POSITIVE', CURRENT_TIMESTAMP),
       ('Dishant Verma', 'MALE', '1988-03-15', 'dishant.verma@example.com', 'A_NEGATIVE', CURRENT_TIMESTAMP),
       ('Neha Iyer', 'FEMALE', '1992-12-01', 'neha.iyer@example.com', 'AB_POSITIVE', CURRENT_TIMESTAMP),
       ('Kabir Singh', 'MALE', '1993-07-11', 'kabir.singh@example.com', 'O_POSITIVE', CURRENT_TIMESTAMP),
       ('Ananya Gupta', 'FEMALE', '1996-01-18', 'ananya.gupta@example.com', 'B_POSITIVE', CURRENT_TIMESTAMP),
       ('Rohan Mehta', 'MALE', '1991-04-22', 'rohan.mehta@example.com', 'AB_NEGATIVE', CURRENT_TIMESTAMP),
       ('Priya Nair', 'FEMALE', '1998-09-30', 'priya.nair@example.com', 'O_NEGATIVE', CURRENT_TIMESTAMP),
       ('Arjun Rao', 'MALE', '1989-11-14', 'arjun.rao@example.com', 'B_NEGATIVE', CURRENT_TIMESTAMP),
       ('Sneha Kulkarni', 'FEMALE', '1994-06-05', 'sneha.kulkarni@example.com', 'A_POSITIVE', CURRENT_TIMESTAMP),
       ('Rahul Joshi', 'MALE', '1990-10-27', 'rahul.joshi@example.com', 'O_POSITIVE', CURRENT_TIMESTAMP),
       ('Meera Reddy', 'FEMALE', '1997-02-09', 'meera.reddy@example.com', 'AB_POSITIVE', CURRENT_TIMESTAMP),
       ('Vikram Shah', 'MALE', '1987-08-17', 'vikram.shah@example.com', 'A_NEGATIVE', CURRENT_TIMESTAMP),
       ('Kavya Menon', 'FEMALE', '1999-03-21', 'kavya.menon@example.com', 'B_POSITIVE', CURRENT_TIMESTAMP),
       ('Aditya Kumar', 'MALE', '1992-05-29', 'aditya.kumar@example.com', 'O_NEGATIVE',
        CURRENT_TIMESTAMP) ON CONFLICT (email) DO NOTHING;

INSERT INTO doctor (name, specialization, email)
VALUES
    ('Dr. Vikram Sharma', 'Cardiology', 'vikram.sharma@example.com'),
    ('Dr. Priya Verma', 'Neurology', 'priya.verma@example.com'),
    ('Dr. Amit Singh', 'Orthopedics', 'amit.singh@example.com'),
    ('Dr. Neha Gupta', 'Pediatrics', 'neha.gupta@example.com'),
    ('Dr. Rahul Joshi', 'Gastroenterology', 'rahul.joshi@example.com'),
    ('Dr. Ananya Rao', 'Gynecology', 'ananya.rao@example.com'),
    ('Dr. Karan Malhotra', 'Dermatology', 'karan.malhotra@example.com'),
    ('Dr. Meera Iyer', 'Ophthalmology', 'meera.iyer@example.com'),
    ('Dr. Suresh Patel', 'ENT', 'suresh.patel@example.com'),
    ('Dr. Kavita Desai', 'Psychiatry', 'kavita.desai@example.com'),
    ('Dr. Rohit Kumar', 'General Medicine', 'rohit.kumar@example.com'),
    ('Dr. Pooja Nair', 'Endocrinology', 'pooja.nair@example.com'),
    ('Dr. Manish Agarwal', 'Pulmonology', 'manish.agarwal@example.com'),
    ('Dr. Simran Kaur', 'Oncology', 'simran.kaur@example.com'),
    ('Dr. Aditya Mehta', 'Urology', 'aditya.mehta@example.com') ON CONFLICT (email) DO NOTHING;

INSERT INTO appointment (appointment_time, reason, doctor_id, patient_id)
VALUES
    ('2025-07-01 10:30:00', 'General Checkup', 1, 2),
    ('2025-07-02 11:00:00', 'Skin Rash', 2, 2),
    ('2025-07-03 09:45:00', 'Knee Pain', 3, 3),
    ('2025-07-04 14:00:00', 'Follow-up Visit', 1, 1),
    ('2025-07-05 16:15:00', 'Consultation', 1, 4),
    ('2025-07-06 08:30:00', 'Allergy Treatment', 2, 5);