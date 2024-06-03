# Camera Connect Documentation - Miscellaneous

###### tags: `doc`

#### Author: @namwoam

## Common Pitfalls

### Error Handling

1. **Platform Differences in Error Handling:**
   - **Web:** On web platforms, if a function throws an error, the website continues to operate normally. The error message is simply displayed in the console tab of the developer tools.
   - **Mobile:** On mobile platforms, throwing an error can cause the entire application to shut down without providing traceable logs. Therefore, it is recommended to avoid using the `throw` statement for error indication. Instead, consider returning `null` or another error value to handle the error more gracefully.

### Permissions

2. **Permissions Request Method:**
   - Requesting access to resources like the camera and microphone can behave differently across platforms. Despite packages claiming cross-platform compatibility, it is essential to test these functionalities in different environments to ensure they work as expected.

## Naming Convention

In this project, we adhere to the Camel Case naming convention for consistency and readability. For instance, a file for a demo debug screen should be named `DemoDebugScreen.tsx` rather than `demo-debug-screen.tsx` or other variants. Maintaining a uniform naming convention across the source code is considered best practice.

## Test Driven Development

We employ test-driven development (TDD) practices in this project to ensure stability and reliability.

### Unit Tests

- **Running Unit Tests:**
  - To initiate unit tests, run:
    ```bash
    npm run test
    ```
  - We use the `jest` library for unit testing. Test files are located at `*.test.ts`.
  - Unit tests are conducted on various parts of the application, such as data models and functions.

### End-to-End Tests

- **End-to-End Testing:**
  - We use the `maestro` library for end-to-end (E2E) testing.
  - We provide two main tests to validate our application:
    1. **Login Test:** This test automates the login process to ensure it works correctly.
    2. **Album Test:** This test creates a new album and verifies that the application runs as expected.
  - Note that certain actions, such as pressing the tab key, may not be supported on the web platform and may require platform-specific adjustments.

## Multilingual Support

To support multiple languages, all display strings are stored in the `/app/i18n/<lang-code>.ts` files. When adding a new UI string, ensure that both English and Chinese versions are defined to maintain multilingual support.

### Adding a New Language String

1. **Define the String:**
   - Add the string in both `en.ts` (English) and `zh.ts` (Chinese) files located in the `/app/i18n/` directory.
   - Example:
     ```typescript
     // en.ts
     const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
  }}

     // zh.ts
     const zh = {
  common: {
    ok: "確定！",
    cancel: "取消",
    back: "返回",
    logOut: "登出",
  }}
     ```

2. **Use the String in Code:**
   - Import the localization module and use the appropriate key to display the string in the UI.
   - Example:
     ```typescript
     <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="welcomeScreen.readyForLaunch"
          preset="heading"
        />
     ```

---

This documentation provides an overview of common pitfalls, naming conventions, test-driven development practices, and multilingual support in the Camera Connect project, ensuring a smooth and consistent development workflow.