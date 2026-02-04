import { beforeEach, describe, it } from "node:test";
import { prisma, type Tag, type User } from "../models/index.ts";
import { adminRequester, testrequester, buildAuthedRequester, generateFakeUser } from "../../test/axios_requester.ts";
import assert from "node:assert";

describe("tag.controller", () => {
    let author: User;
    let authorRequester: ReturnType<typeof buildAuthedRequester>;

    beforeEach(async () => {
        author = await prisma.user.create({
            data: {
                ...generateFakeUser(),
                role: "author"
            }
        });
        authorRequester = buildAuthedRequester(author);
    });

    describe("[GET] /api/tags", () => {
        it("should return all tags from the database", async () => {
            const databaseTags = await prisma.tag.createManyAndReturn({
                data: [
                    { name: "Tag 1", author_id: author.id },
                    { name: "Tag 2", author_id: author.id },
                ]
            });

            const { data: tags } = await adminRequester.get("/tags");

            assert.equal(tags.length, databaseTags.length);
        });

        it("should return an empty array when there are no tags in the database", async () => {
            const { data: tags } = await adminRequester.get("/tags");

            assert.deepStrictEqual(tags, []);
        });

        describe("parameters: limit", () => {
            it("should return the limited number of tags", async () => {
                const databaseTags = await prisma.tag.createManyAndReturn({
                    data: [
                        { name: "Tag 1", author_id: author.id },
                        { name: "Tag 2", author_id: author.id },
                        { name: "Tag 3", author_id: author.id },
                    ]
                });
                const LIMIT = 2;

                const { data: tags } = await adminRequester.get(`/tags?limit=${LIMIT}`);

                assert.equal(tags.length, LIMIT);
                assert.deepStrictEqual(tags[0].name, databaseTags[0].name);
            });
        });

        describe("parameters: page", () => {
            it("should return the tags from page the requested page", async () => {
                await generateMultipleTags(25);
                const PAGE = 2;

                const { data: tags } = await adminRequester.get(`/tags?page=${PAGE}`);

                assert.equal(tags.length, 5); // 20 tags par page par défaut => 5 tags restant pour la page 2
            });
        });

        describe("parameters: author_id", () => {
            it("should only return the tags from the requested user", async () => {
                const AUTHOR_ID = 1;
                await prisma.user.create({ data: generateFakeUser({ id: AUTHOR_ID }) });
                await prisma.user.create({ data: generateFakeUser({ id: AUTHOR_ID + 1 }) });
                await prisma.tag.create({ data: { name: "Tag from user 1", author_id: AUTHOR_ID } });
                await prisma.tag.create({ data: { name: "Tag from user 2", author_id: AUTHOR_ID + 1 } });

                const { data: tags } = await adminRequester.get(`/tags?author_id=${AUTHOR_ID}`);

                assert.equal(tags.length, 1);
                assert.equal(tags[0].name, "Tag from user 1");
            });
        });

        describe("parameters: order", () => {
            it("should only tags in alphabetic order", async () => {
                await prisma.tag.create({ data: { name: "B", author_id: author.id } });
                await prisma.tag.create({ data: { name: "C", author_id: author.id } });
                await prisma.tag.create({ data: { name: "A", author_id: author.id } });

                const { data: tags } = await adminRequester.get(`/tags?order=name:asc`);

                const tagNames = tags.map((tag: any) => tag.name);
                assert.deepStrictEqual(tagNames, ["A", "B", "C"]);
            });
        });


        async function generateMultipleTags(N: number, tag?: Partial<Tag>) {
            const tags: Tag[] = [];

            for (let i = 1; i <= N; i++) {
                const iTag = await prisma.tag.create({
                    data: {
                        name: `Tag n°${i}`,
                        author_id: author.id,
                        ...tag
                    }
                });
                tags.push(iTag);
            }

            return tags;
        }
    });

    describe("[GET] /api/tags/:id", () => {
        it("should return the requested tag with all basic properties", async () => {
            const databaseTag = await prisma.tag.create({
                data: {
                    name: "Mon tag", author_id: author.id
                }
            });

            const { data: tag } = await adminRequester.get(`/tags/${databaseTag.id}`);

            assert.partialDeepStrictEqual(tag, {
                id: databaseTag.id,
                name: databaseTag.name,
                created_at: databaseTag.created_at.toISOString(),
                updated_at: databaseTag.updated_at.toISOString(),
            });
        });

        it("should return the requested with optional and associated properties", async () => {
            const databaseTag = await prisma.tag.create({
                data: {
                    name: "Mon tag",
                    author_id: author.id,
                    color: "#F0F",
                }
            });

            const { data: tag } = await adminRequester.get(`/tags/${databaseTag.id}`);

            assert.partialDeepStrictEqual(tag, {
                id: databaseTag.id,
                name: databaseTag.name,
                color: databaseTag.color,
                author_id: author.id,
                author: {
                    id: author.id,
                    firstname: author.firstname,
                    lastname: author.lastname
                }
            });
        });

        it("should return the whole tag hierarchy", async () => {
            const devTag = await prisma.tag.create({
                data: {
                    name: "Web dev",
                    author_id: author.id,
                }
            });
            const frontTag = await prisma.tag.create({
                data: {
                    name: "Frontend",
                    author_id: author.id,
                    parent_tag_id: devTag.id
                }
            });
            const reactTag = await prisma.tag.create({
                data: {
                    name: "React",
                    author_id: author.id,
                    parent_tag_id: frontTag.id
                }
            });
            const svelteTag = await prisma.tag.create({
                data: {
                    name: "Svelte",
                    author_id: author.id,
                    parent_tag_id: frontTag.id
                }
            });

            const { data: tag } = await adminRequester.get(`/tags/${frontTag.id}`);

            assert.partialDeepStrictEqual(tag, {
                id: frontTag.id,
                name: frontTag.name,
                parent_tag_id: devTag.id,
                parent_tag: {
                    id: devTag.id,
                    name: devTag.name
                },
                children_tags: [
                    { id: reactTag.id, name: reactTag.name },
                    { id: svelteTag.id, name: svelteTag.name },
                ]
            });
        });

        it("should return a 404 when the requested tag does not exist", async () => {
            const UNEXISTING_ID = 42;

            const { status } = await adminRequester.get(`/tags/${UNEXISTING_ID}`);

            assert.equal(status, 404);
        });
    });

    describe("[POST] /api/tags", () => {
        it("should create a tag with the minimum properties", async () => {
            const TAG = { name: "Tag name" };

            const { status, data: tag } = await authorRequester.post("/tags", TAG);

            assert.equal(status, 201);
            assert.ok(tag.id);
            assert.ok(tag.created_at);
            assert.ok(tag.updated_at);
            assert.equal(tag.name, TAG.name);
            assert.equal(tag.author_id, author.id);
        });

        it("should create a tag with a color", async () => {
            const TAG = { name: "Tag name", color: "#F0F" };

            const { data: tag } = await authorRequester.post("/tags", TAG);

            assert.equal(tag.color, TAG.color);
        });

        it("should create a tag that is connected to a parent tag", async () => {
            const parentTag = await prisma.tag.create({ data: { name: "Sport", author_id: author.id } });
            const CHILD_TAG = { name: "Tennis", parent_tag_id: parentTag.id };

            const { data: childTag } = await authorRequester.post("/tags", CHILD_TAG);

            assert.equal(childTag.parent_tag_id, parentTag.id);
        });

        it("should reject the request if the name is already taken", async () => {
            const TAKEN_NAME = "Sport";
            await prisma.tag.create({ data: { name: TAKEN_NAME, author_id: author.id } });

            const { status } = await authorRequester.post("/tags", { name: TAKEN_NAME });

            assert.equal(status, 409);
        });

        it("should reject the request if the provided parent tag does not exist", async () => {
            const TAG = { name: "Tag avec un parent qui n'existe pas", parent_tag_id: 42 };

            const { status } = await authorRequester.post("/tags", TAG);

            assert.equal(status, 404);
        });
    });

    describe("[PATCH] /api/tags/:id", () => {
        let tagToUpdate: Tag;

        beforeEach(async () => {
            tagToUpdate = await prisma.tag.create({
                data: {
                    name: "Tag à mettre à jour",
                    author_id: author.id
                }
            });
        });

        it("should return the updated tag", async () => {
            const NEW_NAME = "Nouveau nom du tag";

            const { status, data: tag } = await adminRequester.patch(`/tags/${tagToUpdate.id}`, { name: NEW_NAME });

            assert.equal(status, 200);
            assert.equal(tag.name, NEW_NAME);
        });

        it("should effectively update the tag in database", async () => {
            const NEW_NAME = "Nouveau nom du tag";

            await adminRequester.patch(`/tags/${tagToUpdate.id}`, { name: NEW_NAME });

            const updatedTag = await prisma.tag.findUniqueOrThrow({ where: { id: tagToUpdate.id } });
            assert.equal(updatedTag.name, NEW_NAME);
        });

        it("should update the color", async () => {
            // TODO
        });

        it("should update the parent tag", async () => {
            // TODO
        });

        it("should unset the color when null is provided", async () => {
            // TODO
        });

        it("should unset the parent tag when null is provided", async () => {
            // TODO
        });

        it("should return a 409 when the new name is already taken", async () => {
            // TODO
        });

        it("should return a 404 when the new parent tag does not exist in the database", async () => {
            // TODO
        });

        it("should return a 403 when the author is not the creator of the tag", async () => {
            // TODO
        });
    });

    describe("[DELETE] /api/tags/:id", () => {
        it("should delete the tags from the database", async () => {
            const tag = await prisma.tag.create({ data: { name: "Niveau à supprimer", author_id: author.id } });

            const { status } = await adminRequester.delete(`/tags/${tag.id}`);

            assert.equal(status, 204);
            const remainingNumberOfTags = await prisma.tag.count();
            assert.equal(remainingNumberOfTags, 0);
        });

        it("should delete the tag if the requester is the author that created the tag", async () => {
            const tag = await prisma.tag.create({ data: { name: "Niveau à supprimer", author_id: author.id } });

            const { status } = await authorRequester.delete(`/tags/${tag.id}`);

            assert.equal(status, 204);
        });

        it("should return a 403 when the requester is an author that is NOT the creator of the tag", async () => {
            const tag = await prisma.tag.create({ data: { name: "Niveau à supprimer", author_id: author.id } });
            const anotherAuthor = await prisma.user.create({ data: generateFakeUser({ id: 42, role: "author" }) });
            const httpRequester = buildAuthedRequester(anotherAuthor);

            const { status } = await httpRequester.delete(`/tags/${tag.id}`);

            assert.equal(status, 403);
        });

        it("should return a 404 when the tag to delete does not exist", async () => {
            const UNEXISTING_TAG_ID = 42;

            const { status } = await adminRequester.delete(`/tags/${UNEXISTING_TAG_ID}`);

            assert.equal(status, 404);
        });
    });
});

