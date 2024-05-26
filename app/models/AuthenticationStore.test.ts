import { AuthenticationStoreModel } from "./AuthenticationStore"

test("can be created", () => {
  const instance = AuthenticationStoreModel.create({
    authToken: "authToken",
    authEmail: "authEmail",
  })

  expect(instance).toBeTruthy()
})

test("can set authToken", () => {
  const instance = AuthenticationStoreModel.create({
    authToken: "authToken",
    authEmail: "authEmail",
  })
  instance.setAuthToken("newAuthToken")
  expect(instance.authToken).toBe("newAuthToken")
})

test("can set authEmail", () => {
  const instance = AuthenticationStoreModel.create({
    authToken: "authToken",
    authEmail: "authEmail",
  })
  instance.setAuthEmail("newAuthEmail")
  expect(instance.authEmail).toBe("newAuthEmail")
})

test("can logout", () => {
  const instance = AuthenticationStoreModel.create({
    authToken: "authToken",
    authEmail: "authEmail",
  })
  instance.logout()
  expect(instance.authToken).toBe("")
  expect(instance.authEmail).toBe("")
})

test("can get isAuthenticated", () => {
  const instance = AuthenticationStoreModel.create({
    authToken: "authToken",
    authEmail: "authEmail",
  })
  expect(instance.isAuthenticated).toBe(true)
})

test("can get validationError", () => {
  const instance = AuthenticationStoreModel.create({
    authToken: "authToken",
    authEmail: "authEmail",
  })
  instance.setAuthEmail("")
  expect(instance.validationError).toBe("can't be blank")
  instance.setAuthEmail("short")
  expect(instance.validationError).toBe("must be at least 6 characters")
  instance.setAuthEmail("invalidEmail")
  expect(instance.validationError).toBe("must be a valid email address")
  instance.setAuthEmail("abc@exmplae.com")
  expect(instance.validationError).toBe("")
})
