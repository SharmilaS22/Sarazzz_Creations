require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const date = require(__dirname + "/date.js");
const bcrypt = require("bcrypt");
const salt = 15;

const fs = require("fs");
const path = require("path");

const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + Date.now());
  },
});
const upload = multer({ storage: storage });

const app = express();
app.use(bodyParser.urlencoded({ extended: !0 }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const Product = require("./models/Product");
const { Review } = require("./models/Review");
const Admin = require("./models/Admin");
const Client = require("./models/Client");
const { Image } = require("./models/Image");

//mongodb atlas connect
const user = process.env.DB_USER;
const password = process.env.PASSWORD;

mongoose
  .connect(
    `mongodb+srv://${user}:${password}@cluster0.pkdey.mongodb.net/sarazDB?retryWrites=true`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

/*----------------- mongoDB API -------------- */
app
  .route("/")
  .get((req, res) => {
    Product.find({}, (err, products) => {
      if (!err) {
        res.render("home", { productDetails: products });
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    Product.findOne({ title: req.body.kindOfProduct }, (err, product) => {
      let count = product.images.length + product.videos.length;
      if (!err && product !== null) {
        res.render("product", { productSpec: product, count: count });
      } else {
        res.send(err);
      }
    });
  });

app.post("/product-review", (req, res) => {
  let reviewPerson = req.body.reviewer;
  const review1 = new Review({
    name: reviewPerson,
    review: req.body.review,
    time: date.getToday(),
  });
  review1.save();
  Product.findOneAndUpdate(
    { title: req.body.orderItem1 },
    { $push: { reviews: review1 } },
    (err, product) => {
      if (!err) {
        res.render("product", { productSpec: product });
      }
    }
  );
});
app.post("/order-product", (req, res) => {
  res.render("purchase", { productName: req.body.orderItem });
});

app.post("/add-product", upload.array("productImageUpload", 10), (req, res) => {
  Product.findOne({ title: req.body.prodTitle }, (err, found) => {
    if (found) {
      res.send(
        "Title already exists, duplicates aren't allowed. Try giving different title."
      );
    } else {
      // console.log(req.files);

      const images = [];
      const videos = [];
      const abouts = [];
      const imageuploads = [];

      req.files.forEach((file) => {
        var image1 = new Image({
          name: file.filename,
          desc: file.originalname,
          img: {
            data: fs.readFileSync(
              path.join(__dirname + "/uploads/" + file.filename)
            ),
            contentType: "image/png",
          },
        });
        image1.save((err) => {
          if (err) {
            res.send(err);
          }
        });
        imageuploads.push(image1);
      });

      prodImage = req.body.prodImage;
      if (prodImage !== "") {
        if (req.body.imageCount == 1) {
          images.push(prodImage);
        } else if (prodImage[0] !== "") {
          for (let i = 0; i < req.body.imageCount; i++) {
            images.push(prodImage[i]);
          }
        }
      }
      if (req.body.aboutCount == 1) {
        abouts.push(req.body.prodAbout);
      } else {
        for (let i = 0; i < req.body.aboutCount; i++) {
          abouts.push(req.body.prodAbout[i]);
        }
      }
      prodVideo = req.body.prodVideo;
      if (prodVideo !== "") {
        if (req.body.videoCount == 1) {
          videos.push(prodVideo);
        } else if (prodVideo[0] !== "") {
          for (let i = 0; i < req.body.videoCount; i++) {
            videos.push(prodVideo[i]);
          }
        }
      }
      const product1 = new Product({
        title: req.body.prodTitle,
        images: images,
        videos: videos,
        abouts: abouts,
        youtubeID: req.body.prodVideoID,
        imgmodel: imageuploads,
      });
      product1.save((err) => {
        if (!err) {
          res.redirect("/");
        } else {
          res.send(err);
        }
      });
    }
  });
});

app
  .route("/authorize-adds")
  .get((req, res) => {
    res.render("login_authorize");
  })
  .post((req, res) => {
    Admin.findOne({ username: req.body.username }, (err, found) => {
      if (err) {
        res.send(err);
      } else if (!found) {
        res.send("Invalid username");
      } else {
        bcrypt.compare(req.body.password, found.password, (err, result) => {
          if (result) {
            res.render("add");
          } else {
            res.send("Invalid password");
          }
        });
      }
    });
  });
app.post("/purchase", (req, res) => {
  const client1 = new Client({
    name: req.body.custName,
    email: req.body.custEmail,
    product: req.body.custProduct,
    location: req.body.custLoc,
    recommendedBy: req.body.custRec,
    date: date.getToday(),
  });

  client1.save((err) => {
    if (!err) {
      res.render("results/success", {
        text1: "Order placed successfully!",
        text2: "Thank you for ordering our Product.",
        text3: "You will be contacted shortly.",
      });
    } else {
      console.log(err);
      res.render("results/failure", {
        text1: "Sorry! There was some problem in placing your order!",
        text2: "Try again.",
      });
    }
  });
});

app.post("/subscribe", (req, res) => {
  const data = {
    members: [
      {
        email_address: req.body.subscriber,
        status: "subscribed",
      },
    ],
  };
  const jsdata = JSON.stringify(data);
  const url = "https://us19.api.mailchimp.com/3.0/lists/eb94ac5157";
  const options = {
    method: "POST",
    auth: process.env.MAILCHIMPAUTH,
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.render("results/success", {
        text1: "Subscribed to Reminders for new Products",
        text2: "Thank you for subscribing.",
        text3: "You will receive emails when a new product's introduced.",
      });
    } else {
      res.render("results/failure", {
        text1: "Sorry! Some error has occured.",
        text2: "Try again.",
      });
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsdata);
  request.end();
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at port 3000");
});
