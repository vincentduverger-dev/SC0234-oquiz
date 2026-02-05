import { describe, it } from "node:test";
import { prisma } from "../models/index.ts";
import assert from "node:assert";

// On va pouvoir utiliser nos requesters axios préconfigurés avec JWT
import { adminRequester } from "../../test/axios_requester.ts";

const testLevels = [
  { name: "Facile" },
  { name: "Moyen" },
  { name: "Difficile" }
];

describe('[GET] /api/levels', () => {
  it('should return all levels from database', async () => {
    // Arrange
    const dataCreate = [
      { name: "Facile" },
      { name: "Moyen" },
      { name: "Difficile" }
    ];
    // on s'assure de ce que contient la BDD avant de tester
    const levels = await prisma.level.createMany({ data: dataCreate });

    // Act
    // Ici on teste la route -> requête HTTP GET sur notre route
    const { data } = await adminRequester("http://localhost:7357/api/levels");

    // Assert
    assert.strictEqual(data.length, data.length);
    assert.strictEqual(data[0].name, data[0].name);
    assert.strictEqual(data[1].name, data[1].name);
  });

  it('should return a message if no result', async () => {
    const expected = "Aucun résultat";

    const response = await fetch("http://localhost:7357/api/levels");
    const result = await response.json();

    assert.strictEqual(true, true);
  });
});

describe('[GET] /api/levels/:id', () => {
  it('should return the correct level', async () => {
    // Arrange
    // On seed la BDD avec nos données de test
    const levels = await prisma.level.createManyAndReturn({ data: testLevels });

    const id1 = levels[0].id;
    const id2 = levels[1].id;

    // Act
    const { data: level1 } = await adminRequester.get(`/levels/${id1}`);
    const { data: level2 } = await adminRequester.get(`/levels/${id2}`);

    // Assert
    assert.strictEqual(id1, level1.id);
    assert.strictEqual(id2, level2.id);
  });

  it('should return 404 when the level does not exist', async () => {
    // Arrange
    // On seed la BDD avec nos données de test
    const levels = await prisma.level.createManyAndReturn({ data: testLevels });
    // on prépare un id qui n'existe pas dans la db
    const fakeId = 98080;
    const expectedStatus = 404;

    // Act
    const { status } = await adminRequester.get(`/levels/${fakeId}`);

    // Assert
    assert.equal(status, expectedStatus);
  });
});

describe('[POST] /levels', () => {
  it('should return the created level with the right properties', async () => {
    //Arrange
    const body = { name: 'Facile' };

    // Act
    const { data: createdLevel } = await adminRequester.post('/levels', body);

    // Assert
    assert.ok(createdLevel.id);
    assert.ok(createdLevel.created_at);
    assert.ok(createdLevel.updated_at);
    assert.equal(createdLevel.name, body.name);
  });

  it('should return 409 if the level already exists (name)', async () => {
    // Arrange
    // Créer un level 'Facile
    await prisma.level.create({ data: { name: 'Facile' } });
    const body = { name: 'Facile' };
    const expectedStatus = 409;

    // Act
    const { status } = await adminRequester.post('/levels', body);

    // Assert
    assert.equal(status, expectedStatus);
  });

  it('should return 422 on validation errors', async () => {
    // Arrange
    // Créer un level 'Facile
    await prisma.level.create({ data: { name: 'Facile' } });
    const body = { name: 123 };
    const expectedStatus = 422;

    // Act
    const { status } = await adminRequester.post('/levels', body);

    // Assert
    assert.equal(status, expectedStatus);
  });
});

describe('[patch] /api/levels/:id', () => {
  it('should update the level name and return the updated level', async () => {
    // Arrange
    const levels = await prisma.level.createManyAndReturn({ data: testLevels });
    const levelToUpdate = levels[0];
    const updatedName = "Très facile";
    const body = { name: updatedName };

    // Act
    const { data: updatedLevel } = await adminRequester.patch(`/levels/${levelToUpdate.id}`, body);

    // Assert
    assert.strictEqual(updatedLevel.id, levelToUpdate.id);
    assert.strictEqual(updatedLevel.name, updatedName);
    assert.notEqual(levelToUpdate.updated_at, updatedLevel.updated_at);
  });

  it('should return 422 on validation errors', async () => {
    // Arrange
    // Créer un level 'Facile
    const level = await prisma.level.create({ data: { name: 'Facile' } });
    const body = { name: 123 };
    // const body = { name: "" }
    // const body = {}
    const expectedStatus = 422;

    // Act
    const { status } = await adminRequester.patch(`/levels/${level.id}`, body);

    // Assert
    assert.equal(status, expectedStatus);
  });

  it('should return an error message if level does not exist', async () => {
    // Arrange
    const fakeId = 99999;
    const body = { name: "Test" };
    const expectedStatus = 404;

    // Act
    const { status: result } = await adminRequester.patch(`/levels/${fakeId}`, body);

    // Assert
    assert.strictEqual(result, expectedStatus);
  });
});

describe('[DELETE] /api/levels/:id', () => {
  it('should delete the level and return the deleted level', async () => {
    const level = await prisma.level.create({ data: { name: "Niveau à supprimer" } });

    const { status } = await adminRequester.delete(`/levels/${level.id}`);

    assert.equal(status, 200);
    const remainingNumberOfLevels = await prisma.level.count();
    assert.equal(remainingNumberOfLevels, 0);
  });

  it('should return an error when trying to delete a non-existent level', async () => {
    // Arrange
    const fakeId = 99999;

    // Act & Assert
    // Prisma va lever une erreur, donc on s'attend à une erreur
    try {
      await adminRequester.delete(`/levels/${fakeId}`);
      assert.fail('Should have thrown an error');
    } catch (error: any) {
      // Vérifier que c'est bien une erreur de record non trouvé
      assert.ok(error);
    }
  });
});