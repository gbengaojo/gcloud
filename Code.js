/**
 * Returns the array of cards that should be rendered for the current
 * e-mail thread. The name of this function is specified in the 
 * manifest 'onTriggerFunction' field, indicating that this function
 * runs every time the add-on is started.
 *
 * @param: {Object} eThe data provided by the Gmail UI.
 * @return {Card[]}
 */
function buildAddOn(e) {
  // Activate temporary Gmail add-on scopes.
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);

  // Get user and thread labels as arrays to enable quick sorting and indexing.
  var threadLabels = message.getThread().getLabels();
  var labels = getLabelArray(GmailApp.getUserLabels());
  var labelsInUse = getLabelArray(threadLabels);

  // Create a section that contains all user Labels.
  var section = CardService.newCardSection()
    .setHeader("<font color=\"#1257e0\"><b>Available User Labels</b></font>");

  // Create a checkbox group for user labels that are added to prior section
  var checkboxGroup = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.CHECK_BOX)
    .setFieldName('labels')
    .setOnChangeAction(CardService.newAction().setFunctionName('toggleLabel'));o

  // Add checkbox with name and selected value for each User Label.
  for (var i = 0; i < labels.length; i++) {
    checkboxGroup.addItem(labels[i], labels[i], labelsInUse.indexOf(labels[i]) != -1)
  }

  // Add the checbox group to the section.
  section.addWidget(checkboxGroup);

  // Build the main card after adding the section.
  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
    .setTitle('QuickLabel')
    .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/label_googblue_48p.png'))
    .addSection(section)
    .build();

  return [card];
}
