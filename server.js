var express = require("express");
var multer = require("multer");
var fs = require("fs");

var app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

var dir;

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
var upload = multer({ storage: storage }).array("files", 12);
app.post("/upload", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      return res.end("Something went wrong:(");
    }
    const repo = "file-upload-trial-project"; //Repo name
    // User name and password of your GitHub
    const userName = "shivsb";
    const password = "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";
    // Set up GitHub url like this so no manual entry of user pass needed
    const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${repo}`;
    // add local git config like username and email
    simpleGit.addConfig("user.email", "2020kuec2005@iiitkota.ac.in");
    simpleGit.addConfig("user.name", "shivsb");
    // Add remore repo url as origin to repo
    simpleGitPromise.addRemote("origin", gitHubUrl);
    // Add all files for commit
    simpleGitPromise.add("./uploads").then(
      (addSuccess) => {
        console.log(addSuccess);
      },
      (failedAdd) => {
        console.log("adding files failed");
      }
    );
    // Commit files as Initial Commit
    simpleGitPromise.commit("Intial commit by simplegit").then(
      (successCommit) => {
        console.log(successCommit);
      },
      (failed) => {
        console.log("failed commmit");
      }
    );
    // Finally push to online repository
    simpleGitPromise.push("origin", "main").then(
      (success) => {
        console.log("repo successfully pushed");
      },
      (failed) => {
        console.log("repo push failed");
      }
    );
    fs.unlinkSync(dir);
    res.end("Upload completed.");
  });
});

app.listen(3000, function (err) {
  if (err) {
    console.log("Error in starting server");
  }
  console.log("Server started successfully");
});
