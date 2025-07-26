
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
2) Login:
3) Today's Prediction:
4) History(7 days):




A brief note on:
Design decisions
Improvements you’d make with more time
How will this scale if each user gets personalised horoscope instead of zodiac zodiac-specific horoscope.
