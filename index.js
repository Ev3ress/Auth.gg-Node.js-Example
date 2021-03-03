var pp = require("child_process");
var color = require("colors");
var req = require("request");
var readline  = require("readline");
var fs = require("fs");

///////////////////////////
var aid = "User AID";
var secret = "App Secret";
var apikey = "User API Key ( Premium Users )";
///////////////////////////

function Say(message)
{
console.log(color.cyan("[") + color.white("~") + color.cyan("] ") + color.white(message));
};

function LoggedIn(username, ip,expiry, email,id, hwid, password)
{
/////////// Logged In! Change It To Your Menu    
console.clear();
Say(`Hey ${username}`);
console.log();
Say(`IP: ${ip}`);
Say(`Expires At: ${expiry}`);
Say(`Email: ${email}`);
Say(`ID: ${id}`)
Say(`HWID: ${hwid}`)
var f = fs.existsSync("Login.txt")
if(!f)
{
try
{
var filepath = (__dirname, "Login.txt");
var writer = fs.createWriteStream(filepath)
writer.write(`${username}:${password}`)
}
catch{}
}
};

function Register(hwid, username, password, email, license)
{
try
{
    var content = {
        "type": "register",
        "aid": aid,
        "apikey": apikey,
        "secret": secret,
        "username": username,
        "password": password,
        "license": license,
        "email": email,
        "hwid": hwid
    }
req.post("https://api.auth.gg/v1/", {form: content},function(err,res,body)
{
try
{
if(body.includes("result\":\"success"))
{
Say(`successfully Registered ${username}`);
return setTimeout(() => {
MainMenu();
}, 3000);
}
else
{
var p = JSON.parse(body)["result"];
if(p == "invalid_license")
{
Say("Invalid License!");
return setTimeout(() => {
MainMenu();
}, 3000);
}
else if(p == "email_used")
{
Say("That Email Is Already Taken!");
return setTimeout(() => {
MainMenu();
}, 3000);
}
else if(p == "invalid_username")
{
Say("Invalid Or Taken Username!");
return setTimeout(() => {
MainMenu();
}, 3000);
}else{Say(`unexpected Response ${p}`)}};}
catch(e)
{
Say("Something Went Wrong..");
Say(e);
}})}
catch(e)
{
console.log(e);
}
};

function Login(hwid, username, password)
{
try
{
    var content = 
    {
        "type": "login",
        "aid": aid,
        "apikey": apikey,
        "secret": secret,
        "username": username,
        "password": password,
        "hwid": hwid
    }
req.post("https://api.auth.gg/v1/", {form: content},function(err,res,body)
{
try
{
if(body.includes("result\":\"success"))
{
var ip = /ip.+[a-z|A-Z|0-9]/.exec(body)[0].split("ip\":\"")[1];
var expires = /expiry.+[a-z|A-Z|0-9]/.exec(body)[0].split("expiry\":\"")[1];
var email = /email.+[a-z|A-Z|0-9]/.exec(body)[0].split("email\":\"")[1];
var id = /id.+[a-z|A-Z|0-9]/.exec(body)[0].split("id\":\"")[1];
LoggedIn(username, ip, expires, email, id, hwid, password);
}
else
{
var p = JSON.parse(body)["result"];
if(p == "invalid_hwid")
{
Say("HWID Error!");
return setTimeout(() => {
MainMenu();
}, 3000);
}
else if(p == "hwid_updated")
{
Say("Your HWID Has Been Updated!");
return setTimeout(() => {
MainMenu();
}, 3000);
}
else if(p == "invalid_details")
{
Say("Invalid Username Or Password!");
return setTimeout(() => {
MainMenu();
}, 3000);
}
else if(p == "time_expired")
{
Say("Your Subscription Has Expired!");
return setTimeout(() => {
MainMenu();
}, 3000);}else{Say(`unexpected Response ${p}`)}};
}
catch(e)
{
Say("Something Went Wrong..");
Say(e);
}
    })
}
catch(e)
{
console.log(e);
}
};

function MainMenu()
{
    var f = fs.existsSync("Login.txt")
    if(!f)
    {
    console.clear();
    var wtf = readline.createInterface({input: process.stdin, output: process.stdout});
    wtf.question("[1] Login\n[2] Register\nOption: ",(bruh=>{
        wtf.close();
        pp.exec("wmic csproduct get uuid",function(err, data)
        {
        var hwid = data.split("\n")[1];
       if(bruh == "1")
       {
        var usernameread = readline.createInterface({input: process.stdin, output: process.stdout});
        usernameread.question("Username: ",(username)=>{
            usernameread.close();
            if(username.length == 0) MainMenu();
            else
            {
                var passwordread = readline.createInterface({input: process.stdin, output: process.stdout});
                passwordread.question("Password: ", (password)=>{
                    passwordread.close();
                    if(password.length == 0) MainMenu();
                    else Login(hwid, username, password);
                })
            }
        })
       }
       else if(bruh == "2")
       {
        var usernameread = readline.createInterface({input: process.stdin, output: process.stdout});
        usernameread.question("Username: ",(username)=>{
            usernameread.close();
            if(username.length == 0) MainMenu();
            else
            {
                var passwordread = readline.createInterface({input: process.stdin, output: process.stdout});
                passwordread.question("Password: ", (password)=>{
                    passwordread.close();
                    if(password.length == 0) MainMenu();
                    else
                    {
                        var emailread = readline.createInterface({input: process.stdin, output: process.stdout});
                        emailread.question("Email: ", (email)=>{
                            emailread.close();
                            if(email.length == 0) MainMenu();
                            else
                            {
                                var licenseread = readline.createInterface({input: process.stdin, output: process.stdout});
                                licenseread.question("License: ", (license)=>{
                                    licenseread.close();
                                    if(license.length == 0) MainMenu();
                                    else Register(hwid, username, password, email, license);
                                })
                            }
                        })
                    }
                })
            }
        })
       }
       else MainMenu();
    })
    }))
}
else
{
var bruh = fs.readFile("Login.txt",function(err, data)
{
    if(data.length == 0 || !data.includes(":"))
    {
    try
    {
        fs.unlinkSync("Login.txt")
    }
    catch{}
    MainMenu();
}
else
{
    var array = data.toString().split(":");
    var username = array[0];
    var password = array[1];
    pp.exec("wmic csproduct get uuid",function(err, data)
    {
    var hwid = data.split("\n")[1];
    Login(hwid, username, password);
    })
}
});
}  
};
MainMenu();