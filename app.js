/**
 * Currrent: This is a working version of app.js to see how the app will work and how the database will work.
 *       This is not the final version of the app.js file and please use and fix Todo-app.js for the final version.
 * 
 * -[x]: Welcome to a wacky ride of understanding this jungle of code.
 */

/*
   * 1. Import the modules from ndoe_modules. uses commonJS syntax. but can be changed to ES6 syntax :pray_hands:.
*/

const http = require('http');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path')
const crypto = require("crypto");

/*
   * 2. Create the epxress app and creates the framework of what the mongoose database will look like.
         You can add anything here that you want to be in the database.
         Please add score to keep track of leaderboard. I have no idea what you will put in though so GL.
*/

const User = mongoose.model('User', {
   name: {
      type: String
   },
   pass: {
      type: String
   },
   code: {
      type: String
   }
});

const app = express();
var db = createConnection();

app.use('/img', express.static(path.join(__dirname, '/app/directory/assets/img')));
app.use('/js', express.static(path.join(__dirname, '/app/directory/assets/js')));
app.use('/dist', express.static(path.join(__dirname, '/app/directory/assets/dist')));
app.use('/css', express.static(path.join(__dirname, '/app/directory/assets/css')));

app.use(express.json())
console.log(db);


// ==================== . [ POST FUNCTIONS] . ==================== //

/*
   Welcome to the deepest part of the jungle. This is where you will want to give up and delete this file I enourage you to do so!

   So essentially the first three functions @createConnection, @createCollection, and @createUser are the only functions that run like once.
      They are needed to start or stop the database incase we need to do error logging or something like that.

   Now if you skimmed down and looked at some of the code you would probably see that there is a lot of promise functions for checking a user or 
   updating a user and you are probably wondering why I dont have a function that dose that and then save time space and energy? Well-

   The next three functions @updateUser, @deleteUser, and @getUser are the functions that I was able to do without throwing my laptop threw the window just do what you expect them to do.
      They are the functions that will be used to update the database and get information from the database.
      Will need to be redone with awaits and asyncs but I am not sure how much work that will be so I will leave it for you!

*/

function createConnection() {
   mongoose.connect('mongodb+srv://c4c-pac-man:zPIONsLyDmJ7VBmU@cluster0.azeuqn4.mongodb.net/pac-man', {
         useNewUrlParser: true
      })
      .then(() => {
         console.log('[*] Connected to Pac-Man Database...')
      })
      .catch((err) => {
         console.log(`[!] There is not a problem.\nError: ${err}`);
         process.exit(-1)
      })

   return '[*] Express attached to database. '
}

function closeConnection() {
   mongoose.connection.close('error', err => {
      if (err) {
         return (err);
      } else {
         return '[!] Connection closing...'
      }
   });
}

function createCollection() {

   User.createCollection().then(() => {
         console.log('[*] Created collection users...')
      })
      .catch((err) => {
         console.log(`[!] There is not a problem.\nError: ${err}`);
         closeConnection()
      })

}

function createUser(username, pass) {
   User.findOne({
      name: username
   }, function(err, docs) {
      if (err) {
         console.log(err);
      } else {
         if (docs == null) {
            console.log("[-] Creating User...");

            const person = new Promise((resolve, reject) => {
               var code = `Welcome to C4C PacMan\n     [ ${username} ].\nHit the instruction\n   button on your\nleft to learn more!`
               var user = new User({
                  name: username,
                  pass: pass,
                  code: code
               });

               user.save(function(err, user) {
                  if (err) {
                     reject("[-] Reject...");
                     return console.error(err)
                  }
                  console.log("[*] User: " + user.name + " saved to user collection.\n[-] Document ID: " + user.id);

                  resolve(user.id);

               });
            });

            person.then(
               (value) => {
                  //console.log(value); // [-] Success!
               },
               (reason) => {
                  //console.error(reason); // [-] Error!
               },
            );
         } else {
            console.log('[-] User already exists... ');
            return '[*] User already exists...';
         }

      }
   });

   return '[*] Complete...';

}

function updateUser(username, code, newpass) {

   const update = new Promise((resolve, reject) => {

      User.findOneAndUpdate({
         name: username
      }, {
         name: username,
         code: code,
         pass: newpass
      }, function(err, docs) {
         if (err) {
            console.log(err)
            reject(err)
         } else {
            resolve('[-] Done with update pass...')
            //console.log("Original Doc : ",docs);
         }
      });


   });

   update.then(
      (value) => {
         User.findOne({
            name: username
         }, function(err, docs) {
            if (err) {
               console.log(err);
            } else {
               console.log("[*] Udpate DB saved...");
            }
         });
         console.log(value); // [-] Success!
         //return value
      },
      (reason) => {
         console.error(reason); // [-] Error!
         //return reason
      },
   );

   return '[*] Complete...';

}

function deleteUser(username) {

    let result;

    try {

        User.findOneAndRemove({
            name: username
         },
         function(err, docs) {
            if (err) {
               console.log(err)
            } else {
               console.log("[=] Removed User : ", docs.name);
            }
       });

       result = '[*] Complete...';

    } catch(error) {
        result = `[!] Error: ${error}...`;
    }

   return result;

}

// ==================== . [ GET PAGES] . ==================== //


/*

If you watched the tutorial I put in the read me you should understand what this part of the code dose.
but if you are a lazy loser like me you can just skim down below and see how it works it dosent really matter since it works and I am not going to change it.


app.get() : This is the function that will get the page that you want to see and shows it to the person who requested it thats what req and res is for.

app.post() : is like the same thing as get but you is done in the background and they dont get to see it. its essentially a sneaky get request.

app.use() : is a function that will use the static folder to get the files that you want to show to the person who requested it.

res.sendFile() : is the function that will send the file that you want to show to the person who requested it.

app.get('*') : this one is prob the only speical thing that you might not get but its just a function that returns that file if the person request a file that dosent exist.
   If you remove all the other get functions and just leave this one you will see what I mean.

*/

app.get('/', (req, res) => {
res.sendFile(__dirname + '/app/directory/static/index.html');
});

app.get('/logout', (req, res) => {
   res.sendFile(__dirname + '/app/directory/static/logout.html');
});

app.get('/pacman', (req, res) => {
   res.sendFile(__dirname + '/app/directory/static/pacman.html');
});

app.get('/account', (req, res) => {
   res.sendFile(__dirname + '/app/directory/static/account.html');
});

app.get('/login', (req, res) => {
   res.sendFile(__dirname + '/app/directory/static/login.html');
});

app.get('/register', (req, res) => {
   res.sendFile(__dirname + '/app/directory/static/register.html');
});

app.get('/users', function(req, res) {
    User.find({}, function(err, users) {
      var userMap = {};
  
      users.forEach(function(user) {
        userMap[user.name] = user;
      });
  
      res.send(userMap);  
    });
});

// ==================== . [ POST ENDPS] . ==================== //

app.post('/code', function(req, res) {
   const {
      username
   } = req.body;
   let result;

   User.findOne({
      name: username
   }, function(err, docs) {
      if (err) {
         console.log(err);
         res.send({
            err,
            username
         });
      } else {

         if (docs == null) {
            result = "[-] No User...";
            res.send({
               result,
               username
            });
         } else {
            if (docs.code) {
               code = {
                  code: docs.code
               }
               res.send(code);
            } else {
               //update()
               code = {
                  code: '//\\\\ = Welcome to C4C-PacMan = \\\\//'
               }
               res.send(code);
            }
         }

      }
   });
});

app.post('/update', function(req, res) {
   const {
      username,
      userauth,
      code,
      pass,
      newpass
   } = req.body;
   const {
      authorization
   } = req.headers;

   let result;

   User.findOne({
      name: username
   }, function(err, docs) {
      if (err) {
         console.log(err);
         res.send({
            err,
            username,
            authorization,
         });
      } else {

         if (docs == null) {
            result = "[-] No User...";
            res.send({
               result,
               username,
               authorization,
            });
         } else {

            try {

               if (userauth == docs.pass) {
                  if (newpass != null && pass != null) {

                    const algorithm = 'aes-192-cbc';

                    const key = crypto.scryptSync(newpass, 'GfG', 24);
                    const iv = Buffer.alloc(16, 0);
                    const cipher = crypto.createCipheriv(algorithm, key, iv);
                    
                    let encryptedPass = cipher.update(newpass, "utf-8", "hex");
                    encryptedPass += cipher.final("hex");

                    updateUser(username, code, encryptedPass)

                     result = '[*] Update Pass Sucess...';

                     res.send({
                        result,
                        username,
                        userauth: encryptedPass,
                        authorization,
                     });

                  } else {
                     updateUser(username, code, userauth)

                     result = '[*] Update Sucess!';

                     res.send({
                        result,
                        username,
                        userauth,
                        authorization,
                     });

                  }

               } else {
                  result = '[!] Wrong Password...]';

                  res.send({
                     result,
                     username,
                     authorization,
                  });
               }

            } catch (error) {
               result = `[!] Contact Support... ${error}`;
               res.send({
                  result,
                  username,
                  authorization,
               });
            }
         }

      }
   });

});

app.post('/delete', (req, res) => {
   const {
      username,
      password
   } = req.body;
   const {
      authorization
   } = req.headers;

   let result;
   User.findOne({
      name: username
   }, function(err, docs) {
      if (err) {
        console.log(username)
         console.log(err);
         res.send({
            err,
            username,
            password,
            authorization,
         });
      } else {

         if (docs == null) {
            result = "[-] No User...";
            res.send({
               result,
               username,
               password,
               authorization,
            });
         } else {

            try {

               const algorithm = 'aes-192-cbc';

               const key = crypto.scryptSync(password, 'GfG', 24);
               const iv = Buffer.alloc(16, 0);
               const cipher = crypto.createCipheriv(algorithm, key, iv);


               let encryptedPass = cipher.update(password, "utf-8", "hex");
               encryptedPass += cipher.final("hex");

               if (encryptedPass == docs.pass) {

                  result = deleteUser(username);

                  res.send({
                     result,
                     username,
                     authorization,
                  });
               } else {
                  result = '[!] Wrong Password...]';

                  res.send({
                     result,
                     username,
                     authorization,
                  });
               }

            } catch (error) {
               result = '[!] Wrong Password...';
               res.send({
                  result,
                  username,
                  password,
                  authorization,
               });
            }
         }

      }
   });

});

app.post('/login', (req, res) => {
   const {
      username,
      password
   } = req.body;
   const {
      authorization
   } = req.headers;

   let result;

   User.findOne({
      name: username
   }, function(err, docs) {
      if (err) {
         console.log(err);
         res.send({
            err,
            username,

            authorization,
         });
      } else {

         if (docs == null) {
            result = "[-] No User...";
            res.send({
               result,
               username,
               authorization,
            });
         } else {

            try {

               const algorithm = 'aes-192-cbc';

               const key = crypto.scryptSync(password, 'GfG', 24);
               const iv = Buffer.alloc(16, 0);
               const cipher = crypto.createCipheriv(algorithm, key, iv);

               // const decipher = crypto.createDecipheriv(algorithm, key, iv);
               // let decryptedPass = decipher.update(docs.pass, "hex", "utf-8");
               // decryptedPass += decipher.final("utf8");

               let encryptedPass = cipher.update(password, "utf-8", "hex");
               encryptedPass += cipher.final("hex");


               console.log("[*] Decrypted Passes Confirmed... ");


               if (encryptedPass == docs.pass) {
                  result = '[*] Correct Password...';

                  res.send({
                     result,
                     username,
                     userauth: encryptedPass,
                     authorization,
                  });
               } else {
                  result = '[!] Wrong Password...';

                  res.send({
                     result,
                     username,
                     authorization,
                  });
               }

            } catch (error) {
               result = '[-] Contact Support]';
               res.send({
                  result,
                  username,
                  authorization,
               });
            }
         }

      }
   });
});

app.post('/register', (req, res) => {
   const {
      username,
      password
   } = req.body;
   const {
      authorization
   } = req.headers;

   let result;

   User.findOne({
      name: username
   }, function(err, docs) {
      if (err) {
         console.log(err);
         res.send({
            err,
            username,

            authorization,
         });
      } else {

         if (docs != null) {
            result = "[-] User already exists...";
            res.send({
               result,
               username,
               authorization,
            });
         } else {

            try {
               const algorithm = 'aes-192-cbc';

               const key = crypto.scryptSync(password, 'GfG', 24);
               const iv = Buffer.alloc(16, 0);
               const cipher = crypto.createCipheriv(algorithm, key, iv);

               let encryptedPass = cipher.update(password, "utf-8", "hex");
               encryptedPass += cipher.final("hex");
               //console.log("[*] Encrypted Pass: " + encryptedPass);

               console.log('[*] Creating User...');

               createUser(username, encryptedPass)

               result = '[*] Complete...';

               res.send({
                  result,
                  username,
                  userauth: encryptedPass,
                  authorization,
               });

            } catch (error) {
               result = `[-] Contact Support:  ${error}`;
               res.send({
                  result,
                  authorization,
               });
            }
         }

      }
   });


});

// ==================== . [ 404 Page] . ==================== //

app.get('*', function(req, res) {
   res.status(404).sendFile(__dirname + '/app/directory/static/404.html');
});


// ===============[ V ]=============== //

/*

app.listen() : starts the express server on the specified port and host: you can use almost any post number you want if its not taken by anothoer thing on your pc

*/

app.listen(1337,'127.0.0.1', () => {
   console.clear()
   console.log(`
    ▐▓█▀▀▀▀▀▀▀▀▀█▓▌░▄▄▄▄▄░
    ▐▓█░PAC-MAN░█▓▌░█▄▄▄█░
    ▐▓█░░░░░░░░░█▓▌░█▄▄▄█░
    ▐▓█▄▄▄▄▄▄▄▄▄█▓▌░█████░
    ░░░░▄▄███▄▄░░░░░█████░

  `)
   console.log('[*] Express server active on port:  [ http://localhost:1337 ]');
});

/*

If you read this far, I cant begin to apologize for everything ive done to you. Thank you for reading my code. I hope you enjoyed it. If you have any questions, feel free message me at: (646) 926-6614

   Goodbye.

*/