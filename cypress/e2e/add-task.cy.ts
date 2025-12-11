describe('Valid tasks', () => {

  it('Add valid task', function() {
    cy.visit('http://localhost:3000')
    cy.get('#root input.w-full').click();
    cy.get('#root input.w-full').type('Task name');
    cy.get('#root textarea.w-full').click();
    cy.get('#root textarea.w-full').type('Description');
    cy.get('#root select.border').select('High');
    cy.get('#root input[type="date"]').click();
    cy.get('#root input[type="date"]').type('2045-12-12');
    cy.get('#root input.w-32').click();
    cy.get('#root input.w-32').type('10');
    cy.get('#root button.text-white').click();
    cy.get('#root div.hidden').click();
    cy.get('#root div.items-center.flex-wrap').click();
    cy.get('#root p.text-sm').should('have.text', 'Description');
    cy.get('#root h3.text-base').should('have.text', 'Task name');
    cy.get('#root div.text-sm.items-center span').should('have.text', 'Due: 12/12/2045');
    cy.get('#root span.text-red-600').should('have.text', 'High');
    cy.get('#root span.flex').should('have.text', ' 10h');
  });

});


describe('Invalid tasks', () => {

    it('Add task with name too long', function() {
    cy.visit('http://localhost:3000')
  });
});
