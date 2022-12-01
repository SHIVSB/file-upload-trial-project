# File-upload-trial-project
- This project is allows the user to update multiple files of different file-types
directly to their github repository, without storing the files on their local computer.
- This project uses ejs as the templating engine and I have used simple-git library for 
automating the process of adding the files, commiting the files and then finally pushing the files to github.
- In order to identify the files, all the files which are pushed at a time are present inside a folder whose name
consists of the date and time of upload. In this way users can easily filter out the files based on date and time.
- For the purpose of autumatically naming the folder with current date and time, I have used the momentjs library.
