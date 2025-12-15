describe('TEST-1 Task title', () => {

  it('TC-1 Task title is empty', function() {
    cy.visit('http://localhost:3000')
    cy.get('#root input.w-full').click();
    cy.get('#root button.text-white').click();
    cy.get('#root p.text-slate-500.font-medium').should('have.text', 'No tasks found');
    cy.get('#root p.text-slate-500.font-medium').should('be.visible');
    cy.get('#root textarea.w-full').click();
    cy.get('#root textarea.w-full').type('asdasd');
    cy.get('#root button.text-white').click();
    cy.get('#root p.text-slate-500.font-medium').should('be.visible');
    cy.get('#root p.text-slate-500.font-medium').should('have.text', 'No tasks found');
  });

  it('TC-2 Task title is is below 3 char', function() {
    cy.visit('http://localhost:3000')
  });

});

it('Task title not enough characters', function() {});

