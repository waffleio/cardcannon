async function getConfig(context, fileName) {
    try {
      const config = await context.config(fileName)
      return config
    } catch (e) {
      app.log.debug(e)
    }
    
    
}

async function createLabelInRepo(context, labelToAddName, labelToAddColor) {
    
    try {
      const allLabelsForRepo = await context.github.paginate(
        context.github.issues.getLabels(context.repo()),
        res => res.data
      )

      let labelExists = false

      allLabelsForRepo.forEach(label => {

        const labelName = label.name

        if (labelName === labelToAddName) {
          labelExists = true
        }    
      })

      if (!labelExists) {
        const newLabel = context.repo({name:labelToAddName, color:labelToAddColor})
        context.github.issues.createLabel(newLabel)
      }
    } catch (e) {
      app.log.debug(e)
    }

}

function addLabelToIssue(context, issue, labelToAdd) {

  let existingLabels = issue.labels

  let labelAlreadyExists = false

  existingLabels.forEach(label => {
    if (label.name === labelToAdd) {
      labelAlreadyExists = true
    }
  })

  if (!labelAlreadyExists) {
    let labelsToAddToIssue = context.repo({number: issue.number, labels: [labelToAdd]});
    context.github.issues.addLabels(labelsToAddToIssue);
  } 
}

function removeLabelFromIssue(context, issue, labelToRemove) {

  let existingLabels = issue.labels

  let labelAlreadyExists = false

  existingLabels.forEach(label => {
    if (label.name === labelToRemove) {
      labelAlreadyExists = true
    }
  })

  if (labelAlreadyExists) {
    let removeLabel = context.repo({number: issue.number, name:labelToRemove});
    context.github.issues.removeLabel(removeLabel);
  } 
    
}

async function getIssuesWithLabel(context, label) {
    
  try {
    const searchForIssues = context.repo({labels:[label]})

    let issuesWithLabel = await context.github.paginate(
      context.github.issues.getForRepo(searchForIssues),
      res => res.data
    )

    return issuesWithLabel
  } catch (e) {
    app.log.debug(e)
  }
}

async function getTopIssues(context, reaction, count) {
    
  try {
    let allIssues = await context.github.paginate(
      context.github.issues.getForRepo(context.repo()),
      res => res.data
    )

    allIssues.sort((a, b) => parseInt(b.reactions[reaction]) - parseInt(a.reactions[reaction]));

    if (allIssues.length >= count) {
      allIssues = allIssues.slice(0,count)
    }

    return allIssues
  } catch (e) {
    app.log.debug(e)
  }
}

module.exports = {
    getConfig: getConfig, 
    addLabelToIssue: addLabelToIssue,
    createLabelInRepo: createLabelInRepo, 
    removeLabelFromIssue: removeLabelFromIssue, 
    getIssuesWithLabel: getIssuesWithLabel, 
    getTopIssues: getTopIssues
}