const util = require('util')

var user1 = {
  name : "Csonka Balint",
  accountNo : "123456",
  accountBal : 200000
}

var user2 = {
  name : "Csonka Mate",
  accountNo : "234567",
  accountBal : 60000
}

//array for storing users
var arrOfUsers = new Array();

//array for storing transactions
var arrOfTransacions = new Array();

//flag for checking existing accountNo
var existingBankAccountNo = false;

//Adding users to the user pool
arrOfUsers.push(user1);
arrOfUsers.push(user2);

//Desposit function
//accountNo: account to deposit to
//depositAmount: amount to deposit to the target account
function deposit(accountNo, depositAmount){
  console.log("Depositing to: " + accountNo + ", Amount: " + depositAmount.toString());
  arrOfUsers.forEach(function(usr) {
    if(usr.accountNo == accountNo){
      existingBankAccountNo = true;
      console.log("     Updating balance");
      //deposit...
      usr.accountBal += depositAmount;
      console.log("     New balance = " + usr.accountBal.toString());
      //logging transacion
      arrOfTransacions.push({
        date: getDateTime(),
        sourceAccount: accountNo,
        tranType: "D",
        amount: depositAmount,
        currentBalance: usr.accountBal
      })
    }
  });

  if (!existingBankAccountNo){
    console.log("     No such bank account number!")
  }
  existingBankAccountNo = false;
}

//withdrawal function
//accountNo: account to withdraw accountFrom
//withdrawAmount: amount to withdraw from target account
function withdraw(accountNo, withdrawAmount){
  console.log("Withdawing from: " + accountNo + ", Amount: " + withdrawAmount.toString());
  arrOfUsers.forEach(function(usr) {
    if(usr.accountNo == accountNo){
      existingBankAccountNo = true;
      console.log("     Checking balance...");
      //checking available balance...
      if (usr.accountBal < withdrawAmount){
        console.log("     Not enough balance!" + "(Balance: " + usr.accountBal +")");
      } else {
        //withdraw...
        usr.accountBal -= withdrawAmount;
        console.log("     Successfull withdrawal!");
        console.log("     New balance = " + usr.accountBal.toString());
        //logging transacion
        arrOfTransacions.push({
          date: getDateTime(),
          sourceAccount: accountNo,
          tranType: "W",
          amount: withdrawAmount,
          currentBalance: usr.accountBal
        })
      }
    }
  });

  if (!existingBankAccountNo){
    console.log("     No such bank account number!")
  }
  existingBankAccountNo = false;
}

//transfer function
//accountFrom: source account
//accountTo: target account
//transferAmount: amount to transfer from A to B
function transfer(accountFrom, accountTo, transferAmount) {
  console.log("Transfering from: " + accountFrom + ", Transfering to: " + accountTo + ", Amount: " + transferAmount.toString());

  arrOfUsers.forEach(function(usr){
    if(usr.accountNo == accountFrom){
      //checking available balance...
      if(usr.accountBal < transferAmount){
        console.log("Not enough money to transfer!");
      } else {
        console.log("Transfering amount...");
        //taking money from source
        usr.accountBal -= transferAmount;
        arrOfUsers.forEach(function(usr2){
          if(usr2.accountNo == accountTo){
            //adding money to target
            usr2.accountBal += transferAmount;
            console.log("Successfull tranfer to: " + usr2.accountNo);
            console.log("New balance (" + usr2.accountNo + "):" + usr2.accountBal);
            //logging transacion
            arrOfTransacions.push({
              date: getDateTime(),
              sourceAccount: accountFrom,
              targetAccount: accountTo,
              tranType: "T",
              amount: transferAmount,
              currentBalance: usr.accountBal
            })
          }
        });
      }
    }
  });
}

//copied this simple date converter from stackoverflow:
//source: https://stackoverflow.com/questions/7357734/how-do-i-get-the-time-of-day-in-javascript-node-js
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "." + month + "." + day + ". " + hour + ":" + min + ":" + sec;
}

//Printing all transaction data to console for given accountNo
function printAccountHistory(accountNo){
  console.log("Transaction history for account: " + accountNo)
  arrOfTransacions.forEach(function(tran){
    if(tran.sourceAccount == accountNo){
      console.log(util.inspect(tran, false, null))
    }
  });
}

//Printing transaction data to console with filters for given accountNo
function printAccountHistoryWithFilter(accountNo, transactionType){
  console.log("Transaction history for account: " + accountNo + ", Transaction type: " + transactionType);
  arrOfTransacions.forEach(function(tran){
    if(tran.sourceAccount == accountNo && tran.tranType == transactionType){
      console.log(util.inspect(tran, false, null))
    }
  });
}


//Demonstartion...
//sequence of simple deposits and withdrawals demonstrating cases when withdrawal and transfer is not possible

deposit('123456', 1000);

deposit('234567', 30000);

withdraw('234567', 7500);

//withdrawing too much currency from 234567
withdraw('234567', 7500000);

deposit('234567', 10000);

deposit('123456', 3000);

withdraw('123456', 1500);

transfer('123456', '234567', 20000);

//transfering too much from 123456
transfer('123456', '234567', 200000000);

//printing filtered histories for 123456
printAccountHistoryWithFilter('123456', 'D');
printAccountHistoryWithFilter('123456', 'W');

//printing complete history for 123456
printAccountHistory('123456');

//printing complete history for 234567
printAccountHistory('234567');
