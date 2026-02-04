import { execSync } from "node:child_process"; // Permet de lancer des commandes de terminal
import type { Server } from "node:http"; // Permet de lancer un serveur http
import { after, before, beforeEach, type TestContext } from "node:test";
import { app } from "../../app.ts";
import { prisma } from "../../models/index.ts";

// ================================================================================
// Objectif de ce fichier : mettre en place l'environnement des tests d'intégration

// === AVANT le lancement des tests ===
// Création d'une BDD de test (oquiztest)
// Chargement des variables d'environnement (.env.test) à l'aide du flag --env-file
// Création des tables dans la BDD de test (run les migrations)
// Lancement du serveur Express

// === Entre chaque test ===
// On vide les tables 

// === APRES les tests ===
// Deconnexion du client BDD Prisma
// Arrêt du serveur serveur Express de test
// Supression de la BDD de test
// ================================================================================


// Serveur HTTP (de test)
let server: Server;

// Hook before : s'exécute une fois avant l'ensemble des tests
// Cross-platform wait
const wait = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

before(async () => {
  try {
    execSync(`docker rm -f oquiztest`, { stdio: 'ignore' });
  } catch (error) {
    // Container doesn't exist, continue
    console.log(error);
  }

  // Docker run command remains the same
  execSync(`docker run -d --name oquiztest -p ${process.env.POSTGRES_PORT}:5432 -e POSTGRES_USER=${process.env.POSTGRES_USER} -e POSTGRES_PASSWORD=${process.env.POSTGRES_PASSWORD} -e POSTGRES_DB=${process.env.POSTGRES_DB} postgres:17-alpine`);

  // Use Promise-based wait instead of shell sleep
  await wait(1000);  // 1 second wait

  execSync(`npx prisma migrate deploy`);

  server = app.listen(process.env.PORT);
});


// Hook beforeEach : s'exécute une fois avant chaque test
beforeEach(async (t) => {
  (t as TestContext).mock.method(console, "info", () => { });

  await truncateTables();
});


// Hook after : s'exécute une fois après l'ensemble des tests
after(async () => {
  // On éteint le serveur HTTP
  server.close();

  // On deconnecte la connexion à la BDD
  await prisma.$disconnect();

  // On éteint la base de données de test
  execSync(`docker rm -f oquiztest`);
});


// Sert à vider les tables
async function truncateTables() {
  // https://stackoverflow.com/questions/3327312/how-can-i-drop-all-the-tables-in-a-postgresql-database
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
};
