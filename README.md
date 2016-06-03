# blogapplication

Steps to undertake:
x create a landingpage       (/)       
x create a register-form     (/register)
x store the user data into the database
x create a login-form
x connect the login form to the database


x create a page per user     (/profile)
x create a log-out button
x on the page a post form
x a list of the (currently logged-in) users posts 
x a list of overyones posts 


x a form through which you can post comments  (/profile)
x a list of comments per post


Tables:

Users: 
userID
username
password

Posts:
UserID     <--RELATED TO
PostID
blogpost

Comments:
UserID       <--RELATED TO
PostID        <--RELATED TO
CommentID
Comment-content