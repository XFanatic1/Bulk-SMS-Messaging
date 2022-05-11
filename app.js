const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/MyDb";
const express = require('express')
const app = express()
const port = 27017
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
var ejs = require('ejs');
app.set('view engine', 'ejs');

var number
var phoneNumbers = []

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

MongoClient.connect(url, function(err, db) {
  const dbo = db.db("MyDb");
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })
  app.post('/', (req, res) => {
    number = String(req.body.number);
    if (number !== '') {
      let myobj = {phoneNumber: number}
      dbo.collection("data").insertOne(myobj, function(err, res) {
        console.log("1 document inserted");
      });
    }

    res.sendFile(__dirname + '/index.html')
  })
  app.post('/send', (req, res) => {
    messageinfo = String(req.body.message);

    dbo.collection('data').find().forEach(function (doc) {
      phoneNumbers.push(doc.phoneNumber)
    });
    console.log(phoneNumbers)
    setTimeout(() => {
      let Time = phoneNumbers.length * 70
      res.render(__dirname + '/sent.ejs', {'time': Time})

      const att = '@txt.att.net'
      const boost = '@sms.myboostmobile.com'
      const cricket = '@mms.cricketwireless.net'
      const sprint = '@messaging.sprintpcs.com'
      const tmobile = '@tmomail.net'
      const uscellular = '@email.uscc.net'
      const verizon = '@vtext.com'

      var nodemailer = require('nodemailer');
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tuftadam@gmail.com',
            pass: '',
        }
      });

      const providers = [att, boost, cricket, sprint, tmobile, uscellular, verizon]

      const sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time))
      }

      const doSomething = async () => {
          for (let i = 0; i < phoneNumbers.length; i++) {
              for (let ii = 0; ii < providers.length; ii++) {
                  await sleep(10000)
                  sendmessage(phoneNumbers[i],providers[ii])
              }
          }
      }

      doSomething()
      function sendmessage(num, pro) {

        var mailOptions = {
        from: 'tuftadam@gmail.com',
        to: num + pro,
        subject: '',
        text: messageinfo
        };
    
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log(num, pro);
        }
        });
      }
      }, 250);
  })
});