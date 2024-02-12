
## Setting up ##

* Clone this repo: $ git clone https://github.com/massaracsh7/CRUD-API.git

* Go to downloaded folder: $ cd CRUD_API.

* Install dependencies: $ npm install

***************************

## Available scripts ##

* **npm run start:dev**
Run the app in development mode

* **npm run start:prod**
Run the app in production mode

* **npm run start:multi**
Run the app in development mode with multiple instances of the application.Cluster API (equal to the number of available parallelism - 1 on the host machine, each listening on port PORT + n) with a load balancer that distributes requests across them.

* **npm run start:prod:multi**
Run the app in production mode with multiple instances of the application

* **npm run test**
Script to launch the test runner.

***************************

## Implementation details ##

* **GET api/users** is used to get all persons
* **GET api/users/{userId}** is used to get data existing user from database
* **POST api/users** is used to create record about new user and store it in database
* **PUT api/users/{userId}** is used to update existing user
* **DELETE api/users/{userId}** is used to delete existing user from database
