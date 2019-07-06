# halifax-online-banking-balance-scrape
## Overview
Javascript web scraper to obtain current account balances from Halifax (UK) online banking using Selenium WebDriver

This script is a proof of concept that will hopefully morph into a bigger project allowing me to check my finances without having to faff about logging into my various online banking institutions. As a seasoned C# developer, this is a personal exercise to practice my javascript development and explore the potential of Selenium WebDriver.

The script navigates through the various stages of the login process using the credential data stored in `config.json`. 3 characters of the memorable word are chosen at random by Halifax, but the script automatically picks the correct character from the `memorableWord` key.

Feel free to use this at your leisure, but be conscious about leaving your banking credentials in the plain text format config file. I accept no liability for consequently emptied bank accounts... etc etc.

## Documentation
```
{
    "pluginName": "Halifax",
    "bankingUrl": "https://www.halifax-online.co.uk/personal/logon/login.jsp",
    "maxAccounts": 10,
    "username": "<username>",
    "password": "<password>",
    "memorableWord": "<memorableWord>"
}
```

- `pluginName`: The name of the plugin that is output to the console. This is pretty much useless.
- `bankingUrl`: The URL of step 1 of the online banking login process.
- `maxAccounts`: The maximum number of bank/credit card accounts the script searches for.
- `username`: Online banking username
- `password`: Online banking password
- `memorableWord`: Online banking memorable word

Script output is as follows (yes I know I need to clean up the balance text):
Halifax plugin
script.js:8
==============
```
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