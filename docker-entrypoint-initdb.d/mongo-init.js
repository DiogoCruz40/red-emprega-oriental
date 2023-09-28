print('Start MONGO DB #################################################################');

db = db.getSiblingDB('rede_emprega_db');
db.createUser(
  {
    user: 'redEmprega',
    pwd: "g9rFv+fm3i56<RszP",
    roles: [{ role: 'readWrite', db: 'rede_emprega_db' }],
  },
);
db.createCollection('administradors');

print('END #################################################################');