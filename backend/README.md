
Register User:

```m
curl -H "Content-Type: application/json"   -X POST   -d '{"username":"admin","password":"password", "permission":"admin"}'   http://localhost:5000/register
```

Login:

```m
curl -H "Content-Type: application/json"   -X POST   -d '{"username":"admin","password":"password"}'   http://localhost:5000/login
```

Access Admin:

```m
curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" http://localhost:5000/admin
```

Create Prescription:

```m
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '{"drug_name":"ozempic", "patient_name":"bob", "quantity":5}' \
http://localhost:5000/prescriptions
```

View Prescriptions:

```m
curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" http://localhost:5000/prescriptions-admin
```

Decrease Prescription:

```m
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '{"id":1,"amount":1}' \
http://localhost:5000/prescriptions/decrease
```