# PopStore

---

- [Setup Process](#setup-process)
- [CI/CD](#cicd)
- [FOSS](#foss)
- [Project Overview](#project-overview)
- [Contributors](#contributors)
- [Known Package Vulnerabilities](#known-package-vulnerabilities)

## Setup Process

### Step-1: Clone GitLab repo for this project locally

You can clone repo locally by git or by downloading the zip file from the GitLab.

**Note:** Make sure you have git installed locally on your computer first. After that run this command.

```sh
git clone https://gitlab.com/CorentinBrasri/popsto.re.git
```

### Step-2: cd into your project

You will need to be inside that project file to enter all the rest of the commands. So remember to type **cd projectName** to move your terminal to working directory.

### Step-3: Install NPM Dependencies

To install all the dependencies you need to run this command.

```sh
npm install
```

or if you prefer yarn

```sh
yarn install
```

### Step-4: Setup env variables

Rename `.env.example` file to `.env` or `.env.local`. Then add the config values for the Firebase and Email.JS.

Alternatively following env variables are used. They should be added in your local .env file and in the CI/CD pipeline as well. 

```sh
# Firebase App Configs
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_ID=
REACT_APP_FIREBASE_MEASUREMENT=

# React Scripts Config (True or False)
FAST_REFRESH=

# Email.JS Service Configs
REACT_APP_EMAILJS_USER_ID=
REACT_APP_EMAIL_JS_TOKEN=
REACT_APP_EMAILJS_SERVICE_ID=
REACT_APP_EMAILJS_TEMPLATE_ID=

# Link of Live Project
REACT_APP_STORE_LINK=
```

### Step-5: Start your application

To start your application you need to run this command.

```sh
yarn start
```

### Step-6: Run tests

To run tests you need to run this command.

```sh
yarn test
```

### Step-7: Build your application

To build your application for production deployment you need to run this command.

```sh
yarn build
```

### Step-8: Deploy your application to firebase hosting

We are using firebase hosting to host/deploy our application. To do so you need to run the following commands:

#### Step 8.1: Login to firebase

To login to firebase you need to run this command. This is only necessary if you haven't already logged in.

```sh
firebase login
```

#### Step 8.2: Deploy your application to firebase hosting

To deploy your application to firebase hosting you need to run this command.

```sh
firebase deploy --only hosting
```

## CI/CD

This application has a CI/CD pipeline setup to automatically build and deploy your application to firebase hosting. The pipeline is triggered whenever a merge request is merged to `main` branch. The pipeline automatically builds and deploy the application to firebase hosting.
If you need to manually deploy your application to firebase hosting after making some changes, please follow the Step-8 in the above setup process.

All env variables are added to the variables section of CI/CD on GitLab project settings. Following type of variables are added there:

- Firebase Configs
- EmailsJS Configs

The CI/CD has the following stages for `main` branch:

- Init
- Test
- Build
- Deploy

While for other branches:

- Init
- Test

## FOSS

- JS Framework: React.js
- UI Framework: Material-UI
- State Management: Redux
- Database: firebase (firestore)
- Authentication: firebase (auth/google-account-sign-in)
- CSV Parser: Modified tabulari.se parser
- Email: Email.JS service

## Project Overview

### M1

Module 1 starts by copy/pasting data from a spreadsheet and clicking "Go" or "Clear". Clicking "Go" takes the owner to Google Login.

### M2

Module 2 is mapping the data. The owner needs to add a store name, description and currency. The drop-downs for name and price need to be chosen. The reference ID and description are optional. If no reference ID is given, it will be created automatically. The owner then clicks "Create PopStore".

### M3

Module 3 is about "My PopStore". The owner sees a list of all stores and the respective link, edit, customer, order and packaging function.

- Clicking the link will allow users to order from the store.
- The edit page allows the owner to edit store name and description. Owner then clicks "update PopStore".
- The customer page has a dropdown where the owner can select a specific customer and see all his orders, including email and phone number and total order value.
- The order pages shows all store items, order quantity and total order value.
- The packaging page shows which orders need to be packaged.

### M4 - new scope

- lock the store function on the edit PopStore page (the store is still visible, but no orders can be made)
- currency conversion for all EU currencies as a dropdown on "My Popstore".
- Description validation with max characters. Mobile view shows "…".
- QR Code

## Contributors

- Ali
- Yousef
- Hamid
- Kim

## Known Package Vulnerabilities

Following packages being used by the project have known vulnerabilities:  
**Package Name:** `nth-check`  
**Vulnerability Severity:** *Moderate*  
**Vulnerability:** `Inefficient Regular Expression Complexity in nth-check`  
**More Info:** [https://github.com/advisories/GHSA-rp65-9cf3-cjxr](https://github.com/advisories/GHSA-rp65-9cf3-cjxr)

---
