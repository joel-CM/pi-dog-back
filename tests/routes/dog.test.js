const { describe, expect, it } = require("@jest/globals");

const app = require("../../src/app.js");
const session = require("supertest");

const agent = session(app);

describe("GET dogs", () => {
  it("devolver un status code de 200", async () => {
    await agent.get("/api/dogs").expect(200);
  });

  it("El tipo de dato devuelto debe ser un array", async () => {
    const res = await agent.get("/api/dogs").expect(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("debería devolver un array mayor o igual a 172", async () => {
    const res = await agent.get("/api/dogs").expect(200);
    expect(res.body.length >= 172).toBe(true);
  });
});

describe("GET dogs querys", () => {
  it("debería devolver un obj con las props del perro correspondiente", async () => {
    const res = await agent.get("/api/dogs?name=Airedale Terrier");
    expect(res.body).toHaveProperty("name", "Airedale Terrier");
    expect(res.body).toHaveProperty("height", "21 - 23");
    expect(res.body).toHaveProperty("weight", "40  -  65");
  });

  it("debería devolver un obj con las props del perro correspondiente", async () => {
    const res = await agent.get("/api/dogs?name=American Foxhound");
    expect(res.body).toHaveProperty("name", "American Foxhound");
    expect(res.body).toHaveProperty("height", "21 - 28");
    expect(res.body).toHaveProperty("weight", "65  -  75");
  });

  it("debería devolver un obj con las props del perro correspondiente", async () => {
    const res = await agent.get("/api/dogs?name=Bracco Italiano");
    expect(res.body).toHaveProperty("name", "Bracco Italiano");
    expect(res.body).toHaveProperty("height", "21.5 - 26.5");
    expect(res.body).toHaveProperty("weight", "55  -  88");
  });
});
