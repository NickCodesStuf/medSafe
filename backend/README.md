
Register User:

```m
curl --header "Content-Type: application/json"   --request POST   -d '{"name":"admin","password":"password", "permission":"admin"}'   http://localhost:5000/register
```

Login:

```m
curl --header "Content-Type: application/json"   --request POST   -d '{"name":"admin","password":"password", "permission":"admin"}'   http://localhost:5000/login
```

Access Admin:

```m
curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" http://localhost:5000/admin
```