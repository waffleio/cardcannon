const helpers = require('./helpers.js')

module.exports = app => {

  app.on('issues.opened', async context => {

    const issueTitle = context.payload.issue.title

    const triggerPattern = /bootstrap my board/gi;
    const triggerRegEx = triggerPattern.test(issueTitle);

    var newIssues = []

  	if (triggerRegEx) {

      const cardData = await getCardData()
      const newIssues = await createCards(context, cardData)
      updateCardRelationships(context, cardData, newIssues)
    }
    
    
  })
}

async function getCardData() {
  const cardsData = await helpers.readFilePromise('./content/cards.json')
  const cardsJSON = JSON.parse(cardsData)
  return cardsJSON
}

async function createCards(context, cardData) {
  let newIssues = []
  
  for (const card of cardData) {
    const response = await (createIssue(context, card))
    newIssues.push({id: card.id, issueNumber: response.data.number})
  }

  return newIssues
}

async function updateCardRelationships(context, cardData, newIssues) {
  
  for (const card of cardData) {


    console.log('break 1')
    console.log('id: ' + card.id + ' is child of: ' + card.childOf)
    const newIssue = newIssues.find(issue => issue.id === card.id);
    console.log('id: ' + card.id + ' is: ' + newIssue.issueNumber)

    if(card.childOf) {
      issue = await getIssue(context, newIssue.issueNumber)
      console.log(issue.data.body)
    }

    

    //const response = await editIssue(context, newIssue.issueNumber, newBody) 

  }

  //return newIssues
}

async function getIssue(context, issueNumber) {
  
  const issue = context.repo({
    number: issueNumber
  })
  const response = await context.github.issues.get(issue)
  return response
  console.log(response)
}

async function createIssue(context, cardData) {
  const cardContentData = await helpers.readFilePromise('./content/cards/' + cardData.file)
  
  const newIssue = context.repo({
    title: cardData.title, 
    labels: cardData.labels,
    body: cardContentData
  })
  const response = await context.github.issues.create(newIssue)
  return response
}

async function editIssue(context, issueNumber, body) {
  
  const newIssue = context.repo({
    body: body
  })
  const response = await context.github.issues.create(newIssue)
  return response
}