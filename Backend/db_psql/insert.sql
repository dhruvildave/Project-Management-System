\ c pms
INSERT INTO
    users
VALUES
    (
        'arpit-vaghela',
        'Dhruvil',
        'Dave',
        'Arpit-Vaghela-0',
        'arpitsinh.v@psu.com'
    ),
    (
        'kaushal-patil',
        'Kaushal',
        'Patil',
        'Kaushal-Patil-0',
        'kaushal.p@psu.com'
    ),
    (
        'dhruvil-dave',
        'Dhruvil',
        'Dave',
        'Dhruvil-Dave-0',
        'dhruvil.d@psu.com'
    ),
    (
        'panth-patel',
        'Panth',
        'Patel',
        'Panth-Patel-0',
        'panth.p@not.psu.com'
    ),
    (
        'prachee-javiya',
        'Prachee',
        'Javiya',
        'Prachee-Javiya-0',
        'prachee.p@not.psu.com'
    );

INSERT INTO
    project(name, createdon, path, createdby)
VALUES
    (
        'A',
        CURRENT_DATE,
        'git:arpit-vaghela:a',
        'arpit-vaghela'
    ),
    (
        'B',
        CURRENT_DATE,
        'git:kaushal-patil:b',
        'kaushal-patil'
    ),
    (
        'C',
        CURRENT_DATE,
        'git:kaushal-patil:c',
        'kaushal-patil'
    ),
    (
        'C',
        CURRENT_DATE,
        'git:dhruvil-dave:c',
        'dhruvil-dave'
    );

INSERT INTO
    member
VALUES
    ('dhruvil-dave', 3, 'member'),
    ('panth-patel', 2, 'member'),
    ('prachee-javiya', 1, 'member');

-- Insert into projectfiles remaining
