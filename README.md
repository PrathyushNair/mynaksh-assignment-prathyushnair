
Setup instructions in README, mention if you have used an AI tool
1) install node packages: npm i
2) spin up database: npm run start-db / docker-compose up /docker compose up
3) create tables: npm run create-tables
4) create an env folder that contains ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET (You may generate you own envs)
4) start server: npm run start-server (nodemon based this keeps the server up and going)


APIs:
1) Sign up: 
 Req: http://localhost:3001/auth/signup
 Req Body: {
  "name": "<name>", 
  "email": "<email>",
  "password": "<password>",
  "birthdate":"<birthday>"
}
Success Response:
Status(200)
{
    "success": true,
    "message": "User signed up successfully."
}
Failure Response:
Validation Failure status code(400) [validation applied for email,password,birthdate(should be of DD-MM-YYYY format)]
{
    "success": false,
    "message": "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
}
Server Failure
status(500)
{
        status: false,
        message: `Signup failed. Try again later`,
      }
2) Login:
Success Response:
Status(200)
{
    "success": true,
    "accessToken": "User signed up successfully."
}
 Req Body: {
  "email": "<email>",
  "password": "<password>",
}
Validation Failure status code(400) [validation applied for email,password]
{
    "success": false,
    "message": "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
}
Server Failure status(500)
{
        status: false,
        message: `Login failed. Try again later`,
      }

3) Today's Prediction:
  Response Status Code(200)
  {
    "success": true,
    "horoscopeReading": [
        {
            "horoscope": "Adventure calls. Try something new or spontaneous.",
            "date": "2025-07-26T09:49:37.252Z"
        }
    ]
}

Server Error Status(500)
{
    "success": false,
    "message": "An error occured.Please try later."
}
4) History(7 days):

 Response Status Code(200) (You will have 7 records of past 7 days if available)
  {
    "success": true,
    "horoscopeReading": [
        {
            "horoscope": "Adventure calls. Try something new or spontaneous.",
            "date": "2025-07-26T09:49:37.252Z"
        }
    ]
}

Server Error Status(500)
{
    "success": false,
    "message": "An error occured.Please try later."
}

A brief note on:
Design decision
Separation of Concerns:  Used Controller and Service architecture for this. Controllers handle HTTP interactions, while services deal with business logic.

Singleton Class:  Used a singleton pattern for the database service to ensure a single shared instance of the connection pool across the entire application lifecycle.

Dependency Inversion: Abstracted the database service behind an interface. This allows for loose coupling between services and the database implementation, facilitating easier future extensibility.

Improvements you’d make with more time
1) Singleton Logging Implementation and Centralised Error Handling
2) Circuit Breaker
3) Migration Scripts for DB.
4) Use Knex/Other ORM
5) Complete implementation of refresh token.

How will this scale if each user gets personalised horoscope instead of zodiac zodiac-specific horoscope.
 Service splitting/ Microservice Create a Horoscope Service.Personal predication(Takes in name, email, birthdate,birthtime)	This will take in email, birthdate,birthtime get the prediction for that date and time and then insert it into a predictions table		This table should have name, id(PK), email, user_id(FK), personal_prediction, prediction_date,current_date columns.If we are using some AI to generate this prediction we can go one step further. Take into account current time ,and then with respect to users  birth date, time and the current time range generate predictions. Stream the data via Kafka.  Each individual service needing personalised prediction may decide to either store the data from kafka into one of their table(will be a replication overhead) or act on the data received from the consumer directly.They should store the prediction into their respective redis so as to avoid recalling the prediction service next time. The service will sit behind a load balancer to handle load.