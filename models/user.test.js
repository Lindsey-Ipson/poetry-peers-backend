const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("user1", "password1");
    expect(user).toEqual({
      username: "user1",
      firstName: "FirstName1",
      lastName: "LastName1",
      email: "user1@email.com",
      isAdmin: true,
    });
  });

  test("unauthorized if no such user", async function () {
    try {
      await User.authenticate("notRealUser", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauthorized if wrong password", async function () {
    try {
      await User.authenticate("user1", "wrongPassword");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

describe("register", function () {
  const newUser = {
    username: "newUser",
    firstName: "First",
    lastName: "Last",
    email: "newUser@test.com",
    isAdmin: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'newUser'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  // test("works: adds admin", async function () {
  //   let user = await User.register({
  //     ...newUser,
  //     password: "password",
  //     isAdmin: true,
  //   });
  //   expect(user).toEqual({ ...newUser, isAdmin: true });
  //   const found = await db.query("SELECT * FROM users WHERE username = 'new'");
  //   expect(found.rows.length).toEqual(1);
  //   expect(found.rows[0].is_admin).toEqual(true);
  //   expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  // });

  test("throws bad request with duplicate data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "user1",
        firstName: "FirstName1",
        lastName: "LastName1",
        email: "user1@email.com",
        isAdmin: true,
      },
      {
        username: "user2",
        firstName: "FirstName2",
        lastName: "LastName2",
        email: "user2@email.com",
        isAdmin: false,
      },
      {
        username: "user3",
        firstName: "FirstName3",
        lastName: "LastName3",
        email: "user3@email.com",
        isAdmin: false,
      }
    ]);
  });
});

describe("get", function () {
  test("works", async function () {
    let user = await User.get("user1");
    expect(user).toEqual({
      username: "user1",
      firstName: "FirstName1",
      lastName: "LastName1",
      email: "user1@email.com",
      isAdmin: true
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("update", function () {
  const updateData = {
    firstName: "UpdatedFirstName",
    lastName: "UpdatedLastName",
    email: "updated@email.com",
    isAdmin: true,
  };

  test("works", async function () {
    let job = await User.update("user1", updateData);
    expect(job).toEqual({
      username: "user1",
      ...updateData,
    });
  });

  test("works: set password", async function () {
    let job = await User.update("user1", {
      password: "newPassword",
    });
    expect(job).toEqual({
      username: "user1",
      firstName: "FirstName1",
      lastName: "LastName1",
      email: "user1@email.com",
      isAdmin: true,
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'user1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update("noSuchUser", {
        firstName: "FirstName",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("user3", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("remove", function () {
  test("works", async function () {
    await User.remove("user1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='user1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("noSuchUser");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

});

