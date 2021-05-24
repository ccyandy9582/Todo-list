# Todo-list
---------
# API using example
### login
```
var newUserOption = {
    uri: "http://localhost:9999/user/login",
    body: `{"email": "${req.body.email}", "password": "${req.body.password}"}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}
request(newUserOption, (err, response) => {
  if (err) throw err
  if (response.statusCode == 200) {
    //do something
  }
})
```
### sign up
```
var newUserOption = {
  uri: "http://localhost:9999/user/create",
  body: `{"email": "${email}", "password": "${password}"}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}
request(newUserOption, (err, response) => {
  if (err) throw err
  if (response.statusCode == 200) {
    //do something
  }
})
```
### get tasks
```
request.get(`http://localhost:9999/todo/user/${email}`, (err, results) => {
  if (err) res.status(400).send()
  if (results.statusCode == 200) {
    // to something
  }
})
```
### create task
```
var newTaskOption = {
  uri: "http://localhost:9999/todo/create",
  body: `{"email": "${email}", "content": "${content}"}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}
request(newTaskOption, (err, response) => {
  if (err) throw err
  if (response.statusCode == 200) {
    //do something
  }
})
```
### delete task
```
const options = {
  url: `http://localhost:9999/todo/delete/${id}`,
  method: "DELETE"
}
request(options, (err, response) => {
  if (err) throw err
  if (response.statusCode == 200) {
    //do something
  }
})
```
### accomplish task
```
const options = {
  url: `http://localhost:9999/todo/update/${id}`,
  method: "PATCH",
  body: `{"content": "${content}", "accomplished": 1}`,
  headers: {
    'Content-Type': 'application/json'
  }
}
request(options, (err, response) => {
  if (err) throw err
  if (response.statusCode == 200) {
    //do something
  }
})
```
