import { describe, it } from "node:test";
import { authorRequester } from "../../test/axios_requester.ts";
import assert from "node:assert";


describe("checkRoles", () => {
    it(async () => {
        // ACT
        const response = await authorRequester.post('/levels/')

        // ASSERT
        assert.strictEqual(response.status, 403)
    });
});