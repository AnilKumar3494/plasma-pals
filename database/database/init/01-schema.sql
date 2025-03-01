CREATE TABLE visits (
    visitID SERIAL PRIMARY KEY,
    customerID SERIAL,
    question1 BIT,
    question2 BIT,
    question3 BIT,
    question4 BIT,
    question5 BIT,
    timeofVisit datetime    
);

CREATE TABLE customers (
    customerID SERIAL PRIMARY KEY,
    email nvarchar(255),
    name nvarchar(255),
    numVisits int,
    finGoal int,
    lastVisit datetime
);