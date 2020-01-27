const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const config = require('./config.json');

const timeout = 10000; 

(async function start() {
    console.log(`${config.pluginName} plugin`);
    console.log("=".repeat(config.pluginName.length + 7));
    console.log("Initialising...");

    let driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(new firefox.Options()
            .headless()
            .windowSize({width: 640, height: 480}))
        .build();
    
    try {
        // 1st Login screen
        //=================
        await driver.get(config.bankingUrl);
        // Find the username textbox and enter the username from config
        await driver.findElement(By.name('frmLogin:strCustomerLogin_userID'))
        .sendKeys(config.username, Key.TAB);
        // Find the password textbox and enter the password from config
        await driver.findElement(By.name('frmLogin:strCustomerLogin_pwd'))
        .sendKeys(config.password, Key.ENTER)
        
        // 2nd login screen
        //=================
        // Wait until the "Memorable Info" comboboxes have rendered. This means the username and password were accepted.
        let by = By.id('frmentermemorableinformation1:strEnterMemorableInformation_memInfo1');
        await driver.wait(until.elementLocated(by), timeout)
            .catch(() => { throw "Error: Username or password invalid"; });
        await driver.wait(until.elementIsVisible(driver.findElement(by)), timeout);
        console.log("Username and password accepted");

        let charCount = 1;
        // Attempt to find the 3x labels requesting each character from the memorable word. The template is "Character n ".
        for (let i = 0; i < config.memorableWord.length; i++) {
            const labelText = "Character ".concat((i + 1).toString());
            await driver.findElement(By.xpath(`//*[contains(text(), '${labelText} ')]`)).then(async function(res) {
                // A matching field was found requesting the nth character. Find enter the appropriate character from the memorable word into the combo box.
                const comboBoxName = "frmentermemorableinformation1:strEnterMemorableInformation_memInfo" + charCount++;
                await driver.findElement(By.name(comboBoxName)).sendKeys(config.memorableWord[i]);
            }).catch(function(err) {
                // The field wasn't found therefore wasn't requested. Move on.
            });
        }

        // Click the "Continue" button.
        driver.findElement(By.id('frmentermemorableinformation1:btnContinue')).click();

        // 3rd login screen
        //=================
        // Wait until the account controls have rendered. This means the memorable data was accepted.
        by = By.className('des-m-sat-xx-account-information');
        await driver.wait(until.elementLocated(by), timeout)
            .catch(() => { throw "Error: Memorable data invalid"; });
        await driver.wait(until.elementIsVisible(driver.findElement(by)), timeout);
        console.log("Memorable word accepted");

        // Extract the divs with class "balance". These contain the account balances (There may be more than 1)
        let accountNames = [];
        let balances = [];
        const balanceElements = await driver.findElements(By.className('balance'));

        for (let i = 0; i < balanceElements.length; i++) {
            const balance = await balanceElements[i].getText();
            if (balance.length > 0) {
                balances.push(balance);
            }
        }

        // Get all of the account names to present alongside the balances
        let allAccountsProcessed = false;
        let accountIndex = 1;
        do {
            const accountNameElement = "lnkAccName_des-m-sat-xx-" + accountIndex++;
            await driver.findElement(By.id(accountNameElement)).then(async function(res) {
                // Account element was found. Get its name.
                const accountName = await res.getText();
                accountNames.push(accountName);
            }).catch(function(err) {
                // Account with index not found. There are no more accounts. We're done here.
                allAccountsProcessed = true;
            });
        } while (!allAccountsProcessed)

        const accountInfo = reconcileAccountsAndBalances(accountNames, balances);

        accountInfo.forEach(info => {
            console.log(`Account: ${info.name}\r\n\t ${info.balance}`);
        });
    } 
    catch(err) {
        console.log(err);
    }
    finally {
        await driver.quit();
    }
})();

function reconcileAccountsAndBalances(accountNames, balances) {
    if (accountNames.length !== balances.length) {
        throw `Something went wrong. ${accountNames.length} account(s) were obtained while ${balances.length} balance(s) were obtained.`;
    }

    const accounts = [];
    for (let i = 0; i < accountNames.length; i++) {
        const account = {
            name: accountNames[i],
            balance: balances[i]
        };
        accounts.push(account);
    }
    return accounts;
}