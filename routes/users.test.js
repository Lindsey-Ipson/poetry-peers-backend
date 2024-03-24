const request = require("supertest");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "newUser",
          firstName: "FirstName-new",
          lastName: "LastName-new",
          password: "password-new",
          email: "newUser@email.com",
          isAdmin: false,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "newUser",
        firstName: "FirstName-new",
        lastName: "LastName-new",
        email: "newUser@email.com",
        isAdmin: false,
      }, token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "newUser",
          firstName: "FirstName-new",
          lastName: "LastName-new",
          password: "password-new",
          email: "newUser@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "newUser",
        firstName: "FirstName-new",
        lastName: "LastName-new",
        email: "newUser@email.com",
        isAdmin: true,
      }, token: expect.any(String),
    });
  });

  test("unauthorized for users", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "newUser",
          firstName: "FirstName-new",
          lastName: "LastName-new",
          password: "password-new",
          email: "newUser@email.com",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauthorized for anonymous user", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "newUser",
          firstName: "FirstName-new",
          lastName: "LastName-new",
          password: "password-new",
          email: "newUser@email.com",
          isAdmin: true,
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "userNew",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          username: "newUser",
          firstName: "FirstName-new",
          lastName: "LastName-new",
          password: "password-new",
          email: "notAnEmail",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

});

describe("GET /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .get(`/users/user2`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: 'user2',
        firstName: 'FirstName2',
        lastName: 'LastName2',
        email: 'user2@email.com',
        isAdmin: false
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .get(`/users/user2`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      user: {
        username: 'user2',
        firstName: 'FirstName2',
        lastName: 'LastName2',
        email: 'user2@email.com',
        isAdmin: false
      },
    });
  });

  test("unauthorized for other users", async function () {
    const resp = await request(app)
        .get(`/users/user3`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauthorized for anonymous user", async function () {
    const resp = await request(app)
        .get(`/users/user1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
        .get(`/users/noSuchUser`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

});

describe("PATCH /users/:username", () => {
  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/users/user2`)
        .send({
          firstName: "NewFirstName",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: 'user2',
        firstName: 'NewFirstName',
        lastName: 'LastName2',
        email: 'user2@email.com',
        isAdmin: false
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .patch(`/users/user2`)
        .send({
          firstName: "NewFirstName",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      user: {
        username: 'user2',
        firstName: 'NewFirstName',
        lastName: 'LastName2',
        email: 'user2@email.com',
        isAdmin: false
      },
    });
  });

  test("unauthorized if not same user", async function () {
    const resp = await request(app)
        .patch(`/users/user2`)
        .send({
          firstName: "NewFirstName",
        })
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauthorized for anonymous user", async function () {
    const resp = await request(app)
        .patch(`/users/user1`)
        .send({
          firstName: "NewFirstName",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
        .patch(`/users/noSuchUser`)
        .send({
          firstName: "NewFirstName",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/users/user1`)
        .send({
          firstName: 123,
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
        .patch(`/users/user1`)
        .send({
          password: "newPassword",
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: 'user1',
        firstName: 'FirstName1',
        lastName: 'LastName1',
        email: 'user1@email.com',
        isAdmin: true
      },
    });
    const isSuccessful = await User.authenticate("user1", "newPassword");
    expect(isSuccessful).toBeTruthy();
  });
  
});

describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .delete(`/users/user2`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "user2" });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .delete(`/users/user2`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: "user2" });
  });

  test("unauthorized if not same user", async function () {
    const resp = await request(app)
        .delete(`/users/user2`)
        .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauthorized for anonymous", async function () {
    const resp = await request(app)
        .delete(`/users/user2`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
        .delete(`/users/noSuchUser`)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

});