const {
  describe,
  expect,
  it,
  beforeAll,
  beforeEach,
} = require("@jest/globals");
const { Dog, conn } = require("../../src/db.js");

describe("Dog model", () => {
  beforeAll(() => {
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
  });

  describe("Validators", () => {
    beforeEach(() => Dog.sync({ force: true }));
    describe("name", () => {
      it("should throw an error if name is null", (done) => {
        Dog.create({})
          .then(() => done(new Error("It requires a valid name")))
          .catch(() => done());
      });
      //todo: expect result true
      it("should work when its a valid name", () => {
        Dog.create({ name: "Pug" });
      });
    });
  });
});
