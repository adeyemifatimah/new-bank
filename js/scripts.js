$(document).ready(function () {
    VanillaTilt.init(document.querySelectorAll(".box"), {
        max: 25,
        speed: 400,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        perspective: 500,
        transition: true
    });
});





// BUSINESS LOGIC

function bankAccount() {
    this.accounts = {};
    this.accountNumber = 1036571134;
}
bankAccount.prototype.AssignNumber = function () {
    this.accountNumber += 1673
    return this.accountNumber;
}

bankAccount.prototype.addAccount = function (account) {
    account.id = this.AssignNumber();
    this.accounts[account.id] = account
}
bankAccount.prototype.deleteAccount = function (id) {
    if (this.accounts[id] === undefined) {
        return false;
    }
    delete this.accounts[id];
    return true;
};
bankAccount.prototype.findAccount = function (id) {
    if (this.accounts[id] != undefined) {
        return this.accounts[id];
    }
    return false;
};
function account(name, balance) {
    this.name = name;
    this.balance = balance;
    this.history  = ["Credit:£" + balance]
}

account.prototype.makeDeposit = function (amount) {
    $("#warn").hide();
    this.balance += parseInt(amount);
    this.history.push("Credit:£" + amount);
}


account.prototype.makeWithdrawl = function (amount) {
    if (amount > this.balance) {
        $("#warn").show();
    } else {
        $("#warn").hide();
        this.balance -= parseInt(amount);
        this.history.push("Debit:£" + amount);
    }
}
account.prototype.getHistory = function () {
    let output = "";
    for (let i = 0; i < this.history.length; i++) {
        if (this.history[i].toString().includes("Debit")) {
            output += "<span class='negative'>" + this.history[i] + "</span>";
        } else {
            output += this.history[i];
        }
        if (i < this.history.length - 1) {
            output += ", ";
        }
    }
    return output;
}

let bank = new bankAccount();
function displayAccount(bank) {
    let accList = $("#accSelect");
    let accHTML = "";
    Object.keys(bank.accounts).forEach(function (key) {
        const account = bank.findAccount(key);
        accHTML += "<option id=" + account.id + ">" + account.name + "</option>";
    });
    accList.html(accHTML);
}
function showAccount(accountId) {
    const account = bank.findAccount(accountId);
    $("#balanceDisp").show();
    $("#accName").html(account.name);
    $("#accNum").html(account.id);
    $("#curBal").html("£" + account.balance);
    $("#accHistory").html(account.getHistory());
    let buttons = $("#buttons");
    buttons.empty();
    buttons.append("<button class='deleteButton' id=" + + account.id + ">Delete</button>");
}
function getSelectedAccount() {
    return parseInt($("#accSelect").children(":selected").attr("id"));
}
function attachAccountListeners() {
    $("#buttons").on("click", ".deleteButton", function () {
        bank.deleteAccount(this.id);
        $("#balanceDisp").hide();
        displayAccount(bank);
    });
}
// USER INTERPHASE

$(document).ready(function () {
    attachAccountListeners();
    $(".newAccForm").submit(function (event) {
        event.preventDefault();
        let name = $("#inputName").val();
        let deposit = parseInt($("#initialDeposit").val());
        if (deposit < 2000) {
            $("#balanceDisp").hide();
            $("#warn2").show();
        } else {
            $("#warn2").hide();
            let newAccount = new account(name, deposit);
            bank.addAccount(newAccount);
            $("#inputName").val("");
            $("#initialDeposit").val("");
            displayAccount(bank);
            showAccount(getSelectedAccount());
        }
    });

    $("#transactionForm").submit(function (event) {
        event.preventDefault();
        let deposit = $("#newDeposit").val();
        let withdraw = $("#newWithdraw").val();
        $("#newDeposit").val("");
        $("#newWithdraw").val("");
        if (getSelectedAccount()) {
            if (deposit) {
                bank.findAccount(getSelectedAccount()).makeDeposit(deposit);
            }
            if (withdraw) {
                bank.findAccount(getSelectedAccount()).makeWithdrawl(withdraw);
            }
            showAccount(getSelectedAccount());
        }
    });
    $("#accSelect").change(function () {
        showAccount(getSelectedAccount());
    });
});
