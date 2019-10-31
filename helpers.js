// const {urlDatabase, users} = require('./express_server') 


// function generateRandomString() {
//   var text = "";
//   var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
//   for (var i = 0; i < 6 ; i++)
//   text += charset.charAt(Math.floor(Math.random() * charset.length));
  
//   return text;
// }


// function emailVerify(email, users) { 
//   console.log(users)
//   for (user in users) {
//     //  console.log(users[user].email)
//     if(users[user].email === email){
//       return true
//     }    
//   }
//    return false 
// } 

// function passwordVerify(password){
//   for (user in users){
//     if(bcrypt.compareSync) {
//     //if(users[user].password === password){
//       return true
//     }
//   }
//   return false 
// }


// function getUserId(email) { 
//   for (userId in users) {
//     //  console.log(users[userId].email)
//     if(users[userId].email === email) {
//       return users[userId].id
//     }    
//   }
//    return false 
// } 

// function urlsForUser(userId) { 
//   const output = {}
//   for (let shortURL in urlDatabase) {
//     if (urlDatabase[shortURL].userID === userId){
//       var id = urlDatabase
//       var url = urlDatabase[shortURL].longUrl
//       output[shortURL] = {longUrl: urlDatabase[shortURL].longUrl, userID: userId}  
//     }
//   }
//   // console.log('output', output) 
//   return output
// }

// module.exports = {
//   generateRandomString, 
//   emailVerify,
//   passwordVerify,
//   getUserId,
//   urlsForUser
// }
