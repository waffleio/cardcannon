const { getIssuesWithLabel, removeLabelFromIssue } = require('./functions')

async function pruneOldLabels(context, issuesToLabel, label) {

    const issuesWithLabel = await getIssuesWithLabel(context, label)

    let keepLabel

    issuesWithLabel.forEach(labeledIssue => {

      keepLabel = false
        
      issuesToLabel.forEach(issueToLabel => {

      if (issueToLabel.number === labeledIssue.number) {
          keepLabel = true
        } 
      })

      if (!keepLabel) {
        removeLabelFromIssue(context, labeledIssue, label)
      }

    })
}

module.exports = {
    pruneOldLabels: pruneOldLabels
}