const helpers = require('./helpers.js')

console.log('app.js running...')

module.exports = app => {
  app.on('issues.opened', async context => {
    const issueTitle = context.payload.issue.title

    const triggerPattern = /bootstrap my board/gi
    const triggerRegEx = triggerPattern.test(issueTitle)

    var newIssues = []

    if (triggerRegEx) {
      console.log('bootstrap running...')

      //move bootstrap issue into progress
      const updateIssue = context.repo({
        number: context.payload.issue.number,
        title: '🗂 bootstrap my board 🏃🏃🏃',
        labels: ['in progress']
      })
      context.github.issues.update(updateIssue)

      //get card data from config
      const cardData = await getCardData()

      //create cards in reverse order for proper order on waffle.io board
      const newIssues = await createCards(context, cardData.reverse())

      //update cards with epic and dependency relationships
      await updateCardRelationships(context, cardData, newIssues)

      //close bootstrap issue
      const closeIssue = context.repo({
        number: context.payload.issue.number,
        state: 'closed'
      })
      context.github.issues.update(closeIssue)
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
    const response = await createIssue(context, card)
    newIssues.push({ id: card.id, issueNumber: response.data.number })
  }

  return newIssues
}

async function updateCardRelationships(context, cardData, newIssues) {
  for (const card of cardData) {
    //console.log('id: ' + card.id + ' is child of id: ' + card.childOf)
    const newIssue = newIssues.find(issue => issue.id === card.id)
    //console.log('id: ' + card.id + ' is: ' + newIssue.issueNumber)

    if (card.childOf) {
      const parentIssue = newIssues.find(issue => issue.id === card.childOf)
      //console.log('parent id: ' + card.childOf + ' is: ' + parentIssue.issueNumber)

      issue = await getIssue(context, newIssue.issueNumber)

      const newBody =
        issue.data.body + '\n\nchild of #' + parentIssue.issueNumber

      await editIssue(context, newIssue.issueNumber, newBody)
    }

    if (card.dependsOn) {
      for (const dependencyId of card.dependsOn) {
        const dependencyIssue = newIssues.find(
          issue => issue.id === dependencyId
        )

        issue = await getIssue(context, newIssue.issueNumber)

        const newBody =
          issue.data.body + '\n\ndepends on #' + dependencyIssue.issueNumber

        await editIssue(context, newIssue.issueNumber, newBody)
      }
    }
  }
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
  const cardContentData = await helpers.readFilePromise(
    './content/cards/' + cardData.id + '.md'
  )

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
    number: issueNumber,
    body: body
  })
  const response = await context.github.issues.update(newIssue)
  return response
}
