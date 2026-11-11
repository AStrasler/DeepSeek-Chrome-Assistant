const assert = require("node:assert/strict");
const { test } = require("node:test");
const app = require("../server");

const expectedHeaders = {
    "content-security-policy": "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "cache-control": "no-store"
};

async function withServer(run) {
    const server = app.listen(0, "127.0.0.1");
    await new Promise((resolve, reject) => {
        server.once("listening", resolve);
        server.once("error", reject);
    });
    try {
        const address = server.address();
        await run(`http://127.0.0.1:${address.port}`);
    } finally {
        await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
}

function assertSecurityHeaders(response) {
    assert.equal(response.headers.get("x-powered-by"), null);
    for (const [name, value] of Object.entries(expectedHeaders)) {
        assert.equal(response.headers.get(name), value, `unexpected ${name}`);
    }
}

test("security headers are present on successful responses", async () => {
    await withServer(async url => {
        const response = await fetch(`${url}/`);
        assert.equal(response.status, 200);
        assertSecurityHeaders(response);
    });
});

test("security headers are present on API and routing errors", async () => {
    await withServer(async url => {
        const badRequest = await fetch(`${url}/chat`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: "{}"
        });
        const notFound = await fetch(`${url}/missing`);
        assert.equal(badRequest.status, 400);
        assert.equal(notFound.status, 404);
        assertSecurityHeaders(badRequest);
        assertSecurityHeaders(notFound);
    });
});
