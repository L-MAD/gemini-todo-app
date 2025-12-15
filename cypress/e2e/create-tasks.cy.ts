describe("TEST-1 Task title", () => {
  it("TC-1 Task title is empty", function () {
    cy.visit("http://localhost:3000");
    cy.get("#root input.w-full").click();
    cy.get("#root button.text-white").click();
    cy.get("#root p.text-slate-500.font-medium").should(
      "have.text",
      "No tasks found",
    );
    cy.get("#root p.text-slate-500.font-medium").should("be.visible");
    cy.get("#root textarea.w-full").click();
    cy.get("#root textarea.w-full").type("asdasd");
    cy.get("#root button.text-white").click();
    cy.get("#root p.text-slate-500.font-medium").should("be.visible");
    cy.get("#root p.text-slate-500.font-medium").should(
      "have.text",
      "No tasks found",
    );
  });

  it("TC-2 Task title is is below 3 char", function () {
    cy.visit("http://localhost:3000");
  });
});

describe("TEST-2 Estimated Hours (Numeric Range)", () => {
  // Reuse the date helper to ensure we always have a valid date
  const getISODate = (dayOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("TC-07 Lower Boundary -1 (Should Show Error)", function () {
    const taskTitle = "Task with Invalid Hours (-1)";

    // 1. Fill Valid Mandatory Fields (Title & Date)
    cy.get("#root input.w-full").type(taskTitle); // Title
    cy.get('#root input[type="date"]').type(getISODate(0), { force: true }); // Date

    // 2. Fill Invalid Hours
    cy.get('input[type="number"]').type("-1");

    // 3. Submit
    cy.get("#root button.text-white").click();

    // 4. Assert Failure
    // Task should NOT be created
    cy.contains(taskTitle).should("not.exist");
    // Verify Error Message
    cy.contains("Hours cannot be negative").should("be.visible");
  });

  it("TC-08 Lower Boundary 0 (Should Create Task)", function () {
    const taskTitle = "Task with 0 Hours";

    cy.get("#root input.w-full").type(taskTitle);
    cy.get('#root input[type="date"]').type(getISODate(0), { force: true });

    // Valid Boundary
    cy.get('input[type="number"]').type("0");

    cy.get("#root button.text-white").click();

    // Assert Success
    cy.contains(taskTitle).should("be.visible");
    cy.get("#root p.text-slate-500.font-medium").should("not.exist");
  });

  it("TC-09 Nominal Value 5.5 (Should Create Task)", function () {
    const taskTitle = "Task with 5.5 Hours";

    cy.get("#root input.w-full").type(taskTitle);
    cy.get('#root input[type="date"]').type(getISODate(0), { force: true });

    // Valid Decimal
    cy.get('input[type="number"]').type("5.5");

    cy.get("#root button.text-white").click();

    // Assert Success
    cy.contains(taskTitle).should("be.visible");
  });

  it("TC-10 Upper Boundary 100 (Should Create Task)", function () {
    const taskTitle = "Task with 100 Hours";

    cy.get("#root input.w-full").type(taskTitle);
    cy.get('#root input[type="date"]').type(getISODate(0), { force: true });

    // Valid Upper Boundary
    cy.get('input[type="number"]').type("100");

    cy.get("#root button.text-white").click();

    // Assert Success
    cy.contains(taskTitle).should("be.visible");
  });

  it("TC-11 Upper Boundary +1 (Should Show Error)", function () {
    const taskTitle = "Task with 101 Hours";

    cy.get("#root input.w-full").type(taskTitle);
    cy.get('#root input[type="date"]').type(getISODate(0), { force: true });

    // Invalid Upper Boundary
    cy.get('input[type="number"]').type("101");

    cy.get("#root button.text-white").click();

    // Assert Failure
    cy.contains(taskTitle).should("not.exist");
    // Verify Error Message
    cy.contains("Hours cannot exceed 100").should("be.visible");
  });

  it("TC-12 Invalid Data Type 'abc' (Should Handle Gracefully)", function () {
    const taskTitle = "Task with ABC Hours";

    cy.get("#root input.w-full").type(taskTitle);
    cy.get('#root input[type="date"]').type(getISODate(0), { force: true });

    // Try to type letters into number field
    // Note: If type="number", browsers typically prevent typing letters entirely
    cy.get('input[type="number"]').type("abc");

    // We check two possibilities depending on your app's implementation:
    // 1. The browser blocked the input, so the value is empty.
    // 2. Or the app shows a validation error upon submit.

    cy.get('input[type="number"]').should("have.value", "");

    // Attempt submit (optional, depending on if empty is allowed)
    // If empty is allowed, this might pass. If "abc" was somehow entered, it should fail.
    // Assuming 'abc' results in empty, and 'Estimated Hours' is Optional (as per requirement):
    // This test ensures that typing "abc" didn't result in a crash or invalid data entry.
  });
});

describe("TEST-4 Due Date Task Creation", () => {
  // Helper function to get dates in YYYY-MM-DD format
  const getISODate = (dayOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  beforeEach(() => {
    cy.visit("/");
  });

  it("TC-17 Yesterday's Date (Should NOT create task)", function () {
    const yesterday = getISODate(-1);
    const taskTitle = "Task with Yesterday Date";

    // 1. Fill in valid Title and Description
    cy.get("#root input.w-full").type(taskTitle);
    cy.get("#root textarea.w-full").type("This description is valid");

    // 2. Fill in INVALID Date (Yesterday)
    cy.get('#root input[type="date"]')
      .clear({ force: true })
      .type(yesterday, { force: true });

    // 3. Submit
    cy.get("#root button.text-white").click();

    // 4. Assert: Task was NOT created
    // We expect the "No tasks found" message to still be there
    cy.get("#root p.text-slate-500.font-medium")
      .should("be.visible")
      .and("have.text", "No tasks found");

    // Optional: Double check the specific title is NOT on page
    cy.contains(taskTitle).should("not.exist");
  });

  it("TC-18 Today's Date (Should create task)", function () {
    const today = getISODate(0);
    const taskTitle = "Task with Today Date";

    // 1. Fill in valid Title and Description
    cy.get("#root input.w-full").type(taskTitle);
    cy.get("#root textarea.w-full").type("This description is valid");

    // 2. Fill in VALID Date (Today)
    cy.get('#root input[type="date"]')
      .clear({ force: true })
      .type(today, { force: true });

    // 3. Submit
    cy.get("#root button.text-white").click();

    // 4. Assert: Task WAS created
    // The "No tasks found" message should NOT exist anymore
    cy.get("#root p.text-slate-500.font-medium").should("not.exist");

    // The specific task title should be visible
    cy.contains(taskTitle).should("be.visible");
  });

  it("TC-19 Tomorrow's Date (Should create task)", function () {
    const tomorrow = getISODate(1); // +1 day
    const taskTitle = "Task with Future Date";

    // 1. Fill in valid Title and Description
    cy.get("#root input.w-full").type(taskTitle);
    cy.get("#root textarea.w-full").type("This description is valid");

    // 2. Fill in VALID Date (Tomorrow)
    cy.get('#root input[type="date"]')
      .clear({ force: true })
      .type(tomorrow, { force: true });

    // 3. Submit
    cy.get("#root button.text-white").click();

    // 4. Assert: Task WAS created
    cy.get("#root p.text-slate-500.font-medium").should("not.exist");
    cy.contains(taskTitle).should("be.visible");
  });
});
