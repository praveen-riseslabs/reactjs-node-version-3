# fullstack-reactjs6

Development setup steps:

---client-side--- 
      1. after cloning the the repo, in the terminal run "npm install" 2. create a ".env" file, and inside of .env file add the following keys with the neccesary value:

            ---Miscellaneous environment variables--- 
            * REACT_APP_SERVER_BASE_API (server side url this is the base url for e.g. "http://localhost:4000)

            ---SSO auth---
            * REACT_APP_GOOGLE_CLIENT_ID (google client id (string))
            * REACT_APP_FACEBOOK_APP_ID (facebook app id (string))

      3. to run the app use "npm run start" command.

--- server-side ---     
      1.cd into Server folder, in the terminal run "npm install"
      2.create a ".env" file, and add following keys with the neccesary value:

            ---Miscellaneous environment variables ---
            * PORT (server port to run on e.g. 4000, 5000)
            * CLIENT_URL (base url for client side (string))
            * SALT_VALUE (salt value for bcrypt password hashing e.g. "5", "10")

            ---Miscellaneous environment variables ---
            * JWT_SECRET (secret string for JWT (string))
            * JWT_EXPIRY_TIME (JWT expriy time (string | number) Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.)

            --- mongoDb environment variables ---
            * MONGO_URI (mongoDb connection string)
            * DB_NAME (mongoDb db name)

            --- nodemailer environment variables ---
            * SERVICE_NAME (service name (string))
            * HOST (host smpt server link (string))
            * MAIL_PORT (port (number) on which to run the nodemailer config transporter)
            * IS_SECURED (secure (booleon))
            * EMAIL (auth.user (string) email address of the sender acc)
            * APP_PASS (auth.pass (string) password of the sender acc)

            #--- AWS credentials environment variables ---
            * BUCKET_NAME (s3 bucket name)
            * BUCKET_REGION (s3 bucket region)
            * ACCESS_KEY = (IAM user access key)
            * SECRET_ACCESS_KEY = (IAM user secret access key)
            * SIGNED_URL_EXPIRATION_VALUE = (expriry value in seconds for get signed url)

      3. to run the app use "npm run start" command
