INSERT INTO patient (name, gender, birth_date, email, blood_group, created_date)
VALUES
    ('Aarav Sharma', 'MALE', '1990-05-10', 'aarav.sharma@example.com', 'O_POSITIVE', CURRENT_TIMESTAMP),
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
    ('Aditya Kumar', 'MALE', '1992-05-29', 'aditya.kumar@example.com', 'O_NEGATIVE', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;
