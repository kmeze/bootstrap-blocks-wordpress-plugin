import {
	clickBlockToolbarButton,
	getAllBlocks,
	selectBlockByClientId,
} from '@wordpress/e2e-test-utils';

// This function also exists in the @wordpress/e2e-test-utils package but somehow the function doesn't work as expected
export const ensureSidebarOpened = async () => {
	try {
		await page.$eval( '.edit-post-sidebar', () => {} );
	} catch ( e ) {
		await page.click(
			'.edit-post-header__settings [aria-label="Settings"]'
		);
	}
};

export const selectBlockByName = async ( name, index = 0 ) => {
	await selectBlockByClientId(
		( await getBlockByName( name, index ) ).clientId
	);
};

export const getBlockByName = async ( name, index = 0 ) => {
	const blocksByName = ( await getAllBlocks() ).filter(
		( block ) => block.name === name
	);
	return blocksByName[ index ];
};

export const clickElementByText = async ( elementExpression, text ) => {
	const [ element ] = await page.$x(
		`//${ elementExpression }[contains(text(),"${ text }")]`
	);
	await page.evaluate( ( el ) => {
		el.click();
	}, element );
};

export const selectOption = async ( label, value ) => {
	const [ selectEl ] = await page.$x(
		`//label[contains(@class,"components-input-control__label") and contains(text(),"${ label }")]/parent::div/following-sibling::div/select[contains(@class, "components-select-control__input")]`
	);
	const selectId = await page.evaluate( ( el ) => el.id, selectEl );
	await page.select( `#${ selectId }`, value );
};

export const getDataValuesOfElement = async ( selector, index = 0 ) => {
	const elements = await page.$$( selector );
	const elementAtIndex = elements[ index ];
	return await page.evaluate(
		( element ) => Object.assign( {}, element.dataset ),
		elementAtIndex
	);
};

export const openSidebarPanelWithTitle = async ( title ) => {
	await ensureSidebarOpened();

	// Check if sidebar panel exists
	await page.waitForXPath(
		`//div[contains(@class,"edit-post-sidebar")]//button[@class="components-button components-panel__body-toggle"][contains(text(),"${ title }")]`
	);

	// Only open panel if it's not expanded already (aria-expanded check)
	const [ panel ] = await page.$x(
		`//div[contains(@class,"edit-post-sidebar")]//button[@class="components-button components-panel__body-toggle"][@aria-expanded="false"][contains(text(),"${ title }")]`
	);
	if ( panel ) {
		await page.evaluate( ( el ) => {
			el.click();
		}, panel );
	}
};

export const getInputValueByLabel = async ( label ) => {
	return await page.$eval(
		`input[aria-label="${ label }"]`,
		( input ) => input.value
	);
};

export const getRichTextValueByLabel = async ( label ) => {
	return await page.$eval(
		`[aria-label="${ label }"].block-editor-rich-text__editable`,
		( richText ) => richText.textContent
	);
};

export const getTextControlValueByLabel = async ( label ) => {
	const [ inputEl ] = await page.$x(
		`//label[contains(@class,"components-base-control__label")][contains(text(),"${ label }")]/following-sibling::input[contains(@class,"components-text-control__input")]`
	);
	return await page.evaluate( ( el ) => el.value, inputEl );
};

export const setTextControlValueByLabel = async ( label, value ) => {
	const [ inputEl ] = await page.$x(
		`//label[contains(@class,"components-base-control__label")][contains(text(),"${ label }")]/following-sibling::input[contains(@class,"components-text-control__input")]`
	);
	await inputEl.type( value );
};

export const inputIsDisabledByLabel = async ( label ) => {
	return (
		( await page.$( `input[aria-label="${ label }"][disabled]` ) ) !== null
	);
};

export const selectIsDisabledByLabel = async ( label ) => {
	const [ selectEl ] = await page.$x(
		`//select[@disabled]/parent::div/preceding-sibling::div/label[contains(text(),"${ label }")]`
	);
	return !! selectEl;
};

export const selectOptionIsAvailable = async ( selectLabel, optionValue ) => {
	const [ optionEl ] = await page.$x(
		`//label[contains(@class,"components-input-control__label") and contains(text(),"${ selectLabel }")]/parent::div/following-sibling::div/select[contains(@class,"components-select-control__input")]/option[@value="${ optionValue }"]`
	);
	return !! optionEl;
};

export const getCheckboxValueByLabel = async ( label ) => {
	const [ inputEl ] = await page.$x(
		`//label[contains(@class,"components-checkbox-control__label")][contains(text(),"${ label }")]/preceding-sibling::span[contains(@class,"components-checkbox-control__input-container")]/input`
	);
	return await page.evaluate( ( el ) => el.checked, inputEl );
};

export const getToggleValueByLabel = async ( label ) => {
	const [ inputEl ] = await page.$x(
		`//label[contains(@class,"components-toggle-control__label")][contains(text(),"${ label }")]/preceding-sibling::span[contains(@class,"components-form-toggle")]/input`
	);
	return await page.evaluate( ( el ) => el.checked, inputEl );
};

export const getSelectedValueBySelectLabel = async ( label ) => {
	const [ selectEl ] = await page.$x(
		`//label[contains(@class,"components-input-control__label") and contains(text(),"${ label }")]/parent::div/following-sibling::div/select[contains(@class,"components-select-control__input")]`
	);
	return await page.evaluate( ( el ) => el.value, selectEl );
};

export const toolbarOptionIsActive = async ( toolbarLabel, buttonText ) => {
	await clickBlockToolbarButton( toolbarLabel ); // Open toolbar
	const isActive =
		(
			await page.$x(
				`//button[contains(text(),"${ buttonText }") and contains(@class,"is-active")]`
			)
		 ).length === 1;
	await page.keyboard.press( 'Escape' ); // Close toolbar
	return isActive;
};
