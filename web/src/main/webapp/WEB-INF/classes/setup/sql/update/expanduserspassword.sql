ALTER TABLE users ALTER COLUMN password TYPE character varying(300);
update users set password = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' where username = 'admin';