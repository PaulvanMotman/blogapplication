# blogapplication

Steps to undertake:
x create a landingpage       (/)       
- create a register-form     (/register)
x create a login-form


- create a page per user     (/profile)
- create a log-out button
- on the page a post form
- a ajax list of their posts inside a clickable div
- an ajax list of overyones posts inside clickable divs


- a (pop-up) page where you can view the post, and post comments    (/individualpost)


Tables:

Users: 
userID
username
password

Posts:
UserID     <--RELATED TO
PostID
Message-content

Comments:
UserID       <--RELATED TO
PostID        <--RELATED TO
CommentID
Comment-content