# halifax-online-banking-balance-scraper
## Overview
Javascript web scraper to obtain current account balances from Halifax (UK) online banking using Selenium WebDriver

This script is a proof of concept that will hopefully morph into a bigger project allowing me to check my finances without having to faff about logging into my various online banking institutions. As a seasoned C# developer, this is a personal exercise to practice my javascript development and explore the potential of Selenium WebDriver.

The script navigates through the various stages of the login process using the credential data stored in `config.json`. 3 characters of the memorable word are chosen at random by Halifax, but the script automatically picks the correct character from the `memorableWord` key.

Feel free to use this at your leisure, but be conscious about leaving your banking credentials in the plain text format config file. I accept no liability for consequently emptied bank accounts... etc etc.

Due to the volatile nature of website design in general, this scraper works as of 08/07/2019.

## Installation
### Dependencies
- Ensure Mozilla Firefox is installed on the execution machine 
- Download the geckodriver proxy designated for your OS and architecture. The executable needs to be accessible from a directory configured in the PATH environment variable. Geckodriver available here: https://github.com/mozilla/geckodriver/releases

### Setup
Execute `npm install` to install dependencies.

Make a copy of `config.json.example` removing the `.example` extension. Modify the config file with the appropriate username, password and memorable data
```
{
    "pluginName": "Halifax",
    "bankingUrl": "https://www.halifax-online.co.uk/personal/logon/login.jsp",
    "username": "<username>",
    "password": "<password>",
    "memorableWord": "<memorableWord>"
}
```

- `pluginName`: The name of the plugin that is output to the console. This is pretty much useless.
- `bankingUrl`: The URL of step 1 of the online banking login process.
- `username`: Online banking username
- `password`: Online banking password
- `memorableWord`: Online banking memorable word

## Usage
run `node script.js`

## Output 
Script output is as follows (yes I know I need to clean up the balance text):

```
Halifax plugin
==============
Initialising...
Username and password accepted
Memorable word accepted
Account: Main Account
	 £ 100.00 Balance
Account: Another Account
	 £ 50.00 Balance
Account: Yet Another Account
	 £ 50.00 Balance
Account: Halifax Mastercard
	 £ 100.00 Current balance
```