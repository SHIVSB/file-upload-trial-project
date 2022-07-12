var express = require("express");
var multer = require("multer");
const simpleGit = require("simple-git")();
const simpleGitPromise = require("simple-git/promise")();
const moment = require("moment");
var fs = require("fs");

var app = express();
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

var dir, fname;
const currentTime = moment(Date.now())
  .format("MMMM Do YYYY, h:mm:ss a")
  .replace(/ /g, "-")
  .replace(/,/g, "")
  .replace(/:/g, "-");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    dir = "./uploads/uploaded" + currentTime;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },

  filename: function (req, file, callback) {
    fname = file.originalname;
    callback(null, file.originalname);
  },
});
var upload = multer({ storage: storage }).array("files", 12);
app.post("/upload", function (req, res, next) {
  upload(req, res, async function (err) {
    if (err) {
      return res.end("Something went wrong:(");
    }
    const repo = "file-upload-trial-project"; //Repo name
    // User name and password of your GitHub
    // const userName = "";
    // const password = "";
    // Set up GitHub url like this so no manual entry of user pass needed
    // const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${repo}`;
    // add local git config like username and email
    simpleGit.addConfig("user.email", "2020kuec2005@iiitkota.ac.in");
    simpleGit.addConfig("user.name", "shivsb");
    // Add remore repo url as origin to repo
    // simpleGitPromise.addRemote("origin", gitHubUrl);
    // Add all files for commit
    await simpleGitPromise.add(dir).then(
      (addSuccess) => {
        console.log(addSuccess);
      },
      (failedAdd) => {
        console.log("adding files failed");
      }
    );
    // Commit files as Initial Commit
    await simpleGitPromise
      .commit("File/folder uploaded By simplegit " + fname)
      .then(
        (successCommit) => {
          console.log(successCommit);
        },
        (failed) => {
          console.log("failed commmit");
        }
      );
    // console.log(dir + "/" + fname);
    // Finally push to online repository
    await simpleGitPromise.push("origin", "main").then(
      (success) => {
        console.log("repo successfully pushed");
        fs.rmSync(dir, { recursive: true, force: true });
      },
      (failed) => {
        console.log("repo push failed");
      }
    );

    res.end("Upload completed.");
  });
});

app.listen(3000, function (err) {
  if (err) {
    console.log("Error in starting server");
  }
  console.log("Server started successfully");
});
