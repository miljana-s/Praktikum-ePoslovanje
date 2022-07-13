# Generate a pair of RSSA keys (private and public)

## OpenSSL

openssl req -newkey rsa:2048 -new -nodes -keyout name.private -out name.csr

openssl x509 -req -days 365 -in name.csr -signkey name.private -out name.public

openssl req -newkey rsa:2048 -new -nodes -keyout administrator-auth.private -out administrator-auth.csr
openssl x509 -req -days 365 -in administrator-auth.csr -signkey administrator-auth.private -out administrator-auth.public
openssl req -newkey rsa:2048 -new -nodes -keyout administrator-refresh.private -out administrator-refresh.csr
openssl x509 -req -days 365 -in administrator-refresh.csr -signkey administrator-refresh.private -out administrator-refresh.public
