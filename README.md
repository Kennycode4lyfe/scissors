# URL SHORTENER

This is a web app that allows users customize, shorten their long urls and provides analytics for the shortened urls

---

## Features

### `Shorten long urls`

This app allows users to shorten their long urls

### `Qr code generator`

This app allows users to create qr codes for their shortened urls for easy accessibility

### `Analytics`

####`Url history`
This app shows an history of urls generated by the user

#### `Clicks`

This app allows users to view the number of clicks on their generated urls

### `Delete`

This app allows users to delete generated url links
---

## Setup

- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm install` to install packages
- run `npm start` to start server

---

## Test

- run `npm run test` to perform test on endpoints

## Deployed URL

- <p><a href="https://chatbot-y67d.onrender.com">click here to view deployed site</a></p>

## Backend

### Models

---

#### user

| field      | data_type | constraints |
| ---------- | --------- | ----------- |
| id         | string    | required    |
| created_at | date      | optional    |
| username   | string    | required    |
| username   | objectId  | optional    |

#### url

| field  | data_type | constraints |
| ------ | --------- | ----------- |
| user   | objectId  | optional    |
| full   | string    | required    |
| short  | sting     | optional    |
| clicks | number    | optional    |
| qrLink | string    | optional    |

## frontend

### Enter a username to redirect to homepage

![enter a username](</frontend/public/assets/enter_username.png>)

### Enter url details

![enter url details](</frontend/public/assets/enter_url_details.png>)

### click the generate button to generate a short url 

![click the generate button](</public/assets/short_url_generated.png>)

### click the analytics button to show insights on the generated url 

![click the analytics button](</public/assets/analytics.png>)

### click the qr-code button to show qr-code for the generated url

![click the qr-code button](<public/assets/qr_code.png>)



## Contributor

- Adediran Kehinde
