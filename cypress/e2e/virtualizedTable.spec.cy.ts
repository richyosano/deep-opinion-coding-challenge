describe('Virtualized Table', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('renders correctly', () => {
		cy.get('#appContainer').should('exist');
	});

	it('renders scroll to top button only when user scrolls down past the first item in the table', () => {
		cy.get('[data-testid="virtualizedTableContainer"]').scrollTo(0, 100);
		cy.get('[data-testid="scrollToTop"]').should('exist');
		cy.get('[data-testid="virtualizedTableContainer"]').scrollTo('top');
		cy.get('[data-testid="scrollToTop"]').should('not.exist');
	});

	it('scrolls to top when scroll to top button is clicked', () => {
		const minIndex = 0;
		cy.get('[data-testid="virtualizedTableContainer"]').scrollTo(0, 700);
		cy.get('[data-testid="scrollToTop"]').click();
		cy.get('[data-testid="virtualizedTableContainer"]')
			.invoke('scrollTop')
			.should('equal', 0);
		cy.get(`[data-testid="tableItem_${minIndex}"]`).should('exist');
	});

	it('adds a new item when new product button is clicked', () => {
		const totalProducts = 200000;
		const maxIndex = totalProducts - 1;
		cy.get('[data-testid="pageTitle"]').should(
			'contain.text',
			`${totalProducts.toLocaleString()}`
		);
		cy.get('[data-testid="virtualizedTableContainer"]').scrollTo('bottom');

		// 1st click
		cy.get(`[data-testid="tableItem_${maxIndex + 1}"]`).should('not.exist');
		cy.get('[data-testid="newProductBtn"]').click();
		cy.get('[data-testid="pageTitle"]').should(
			'contain.text',
			`${(totalProducts + 1).toLocaleString()}`
		);
		cy.get(`[data-testid="tableItem_${maxIndex + 1}"]`).should('exist');
		cy.get(`[data-testid="tableItem_${maxIndex + 2}"]`).should('not.exist');

		// 2nd click
		cy.get('[data-testid="newProductBtn"]').click();
		cy.get('[data-testid="pageTitle"]').should(
			'contain.text',
			`${(totalProducts + 2).toLocaleString()}`
		);
		cy.get(`[data-testid="tableItem_${maxIndex + 2}"]`).should('exist');
		cy.get(`[data-testid="tableItem_${maxIndex + 3}"]`).should('not.exist');
	});
});
