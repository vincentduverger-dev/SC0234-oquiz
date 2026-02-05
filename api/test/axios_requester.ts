import axios from 'axios';
import type { User } from '../src/models/index.ts';
import { generateAuthTokens } from '../src/lib/tokens.ts';

export const apiBaseUrl = `http://localhost:${process.env.PORT}/api`;

export const testrequester = axios.create({
    baseURL: apiBaseUrl,
    validateStatus: () => true, // pour que axios ne lève pas d'exception sur les 4XX 5XX
});



// On se crée des requester (instances axios préconfigurées) qui vont nous permettre de tester les routes sur lesquelles on a placé le checkRoles - avec des rôles différents


// == ADMIN ==
const userAdmin: User = {
    id: 123,
    firstname: "John", lastname: "Doe", email: "john@oclock.io", password: "$argon2id$v=19$m=65536,t=3,p=4$DXOFdkk1gmX5l0FogtI3fA$6rks8DLL/0Bcrddfj2E0DPlt3RunF2vObpLVfh8WG3U", role: "admin", created_at: new Date(), updated_at: new Date()
}

const { accessToken: accessTokenAdmin } = generateAuthTokens(userAdmin)

export const adminRequester = axios.create({
    baseURL: apiBaseUrl,
    validateStatus: () => true, // pour que axios ne lève pas d'exception sur les 4XX 5XX
    headers: {
        Authorization: `Bearer ${accessTokenAdmin.token}`
    }
});

// == AUTHOR ==
const userAuthor: User = {
    id: 123,
    firstname: "John", lastname: "Doe", email: "john@oclock.io", password: "$argon2id$v=19$m=65536,t=3,p=4$DXOFdkk1gmX5l0FogtI3fA$6rks8DLL/0Bcrddfj2E0DPlt3RunF2vObpLVfh8WG3U", role: "author", created_at: new Date(), updated_at: new Date()
}

const { accessToken: accessTokenAuthor } = generateAuthTokens(userAuthor)

export const authorRequester = axios.create({
    baseURL: apiBaseUrl,
    validateStatus: () => true, // pour que axios ne lève pas d'exception sur les 4XX 5XX
    headers: {
        Authorization: `Bearer ${accessTokenAuthor.token}`
    }
});


// Utilitaires pour tests endpoints

// Utilitaire pour fabriquer un faux utilisateur
let fakeUserId = 0;
export function generateFakeUser(user?: Partial<User>): User {
    fakeUserId++;
    return {
        id: fakeUserId,
        firstname: "firstname",
        lastname: "lastname",
        email: `user${fakeUserId}@oclock.io`,
        password: "P4$$w0rd",
        role: "admin",
        created_at: new Date(),
        updated_at: new Date(),
        ...user
    };
};

// Utilitaire pour faire des appels API en tant que "l'user passé en argument"
// Authentification stateless ou stateful au choix, selon si l'utilisateur fourni en argument est également ajouté à la BDD ou non durant l'écriture du test
export function buildAuthedRequester(user: User) {
    const { accessToken } = generateAuthTokens(user);
    return axios.create({
        baseURL: apiBaseUrl, // pour ne pas avoir besoin de préfixer par `http://localhost:7357/api`
        headers: { "Authorization": `Bearer ${accessToken.token}` }, // pour authentifier les requêtes
        validateStatus: () => true // pour que axios ne lève pas d'exception sur les 4XX 5XX
    });
}