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
    cy.visit("http://localhost:3000");
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
