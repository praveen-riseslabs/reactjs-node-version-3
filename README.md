# fullstack-reactjs6


Development setup steps 
--- client-side
      1. after cloning the the repo, in the terminal run "npm install"
      2. create a ".env" file, and add following keys with the neccesary value:
            * REACT_APP_SERVER_BASE_API (server side url this is the base url for e.g. "http://localhost:4000)
      3. to run the app use "npm run start" command.
      
--- server-side
      1.cd into Server folder, in the terminal run "npm install"
      2.create a ".env" file, and add following keys with the neccesary value:
            * PORT (server port to run on e.g. 4000, 5000)
            * MONGO_URI (mongoDb connection string)
            * DB_NAME (mongoDb db name)
            * SALT_VALUE (salt value for bcrypt password hashing e.g. "5", "10")
      3. to run the app use "npm run start" command
