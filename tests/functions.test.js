var { getConfig, addLabelToIssue, createLabelInRepo, removeLabelFromIssue, getIssuesWithLabel, getTopIssues, labelIssues, pruneOldLabels  } = require('../functions')

describe('createLabelInRepo', () => {
    let context, issues;

    beforeEach( () => {
        issues = [
            {name: 'label a', color: 'ffffff'},
            {name: 'label b', color: '000000'}
        ]
        context = {
            github: {
                issues: {}
            }
        };
        context.github.paginate = jest.fn().mockResolvedValue(issues)
        context.github.issues.getLabels = jest.fn()
        context.github.issues.createLabel = jest.fn()
        context.repo = jest.fn()
    })

    test("creates label if label doesn't exist", async () => {
        const name = 'label'
        const color = 'aaa111'
        await createLabelInRepo(context, name, color);

        expect(context.github.issues.createLabel).toBeCalledTimes(1)

    })

    test("does not create label if label does exist", async () => {
        const name = 'label b'
        const color = 'aaa111'
        await createLabelInRepo(context, name, color);

        expect(context.github.issues.createLabel).not.toBeCalled

    })
})

describe('getTopIssues', () => {
    let context, issues;

    beforeEach( () => {
        issues = [
            {
                "number": 1,
                "title": "Found a bug",
                "reactions": {
                "total_count": 0,
                "+1": 0
                }
            }, 
            { 
                "number": 2,
                "title": "Found a bug",
                "reactions": {
                "total_count": 3,
                "+1": 3
                }
            },
            { 
                "number": 3,
                "title": "Found a bug",
                "reactions": {
                "total_count": 0,
                "+1": 0
                }
            },
            { 
                "number": 4,
                "title": "Found a bug",
                "reactions": {
                "total_count": 0,
                "+1": 0
                }
            },
            { 
                "number": 5,
                "title": "Found a bug",
                "reactions": {
                "total_count": 0,
                "+1": 0
                }
            },
            { 
                "number": 6,
                "title": "Found a bug",
                "reactions": {
                "total_count": 0,
                "+1": 0
                }
            },
            { 
                "number": 7,
                "title": "Found a bug",
                "reactions": {
                "total_count": 9,
                "+1": 9
                }
            },
            { 
                "number": 8,
                "title": "Found a bug",
                "reactions": {
                "total_count": 0,
                "+1": 0
                }
            },
            { 
                "number": 9,
                "title": "Found a bug",
                "reactions": {
                "total_count": 0,
                "+1": 0
                }
            },
            { 
                "number": 10,
                "title": "Found a bug",
                "reactions": {
                "total_count": 6,
                "+1": 6
                }
            }
        ]
        context = {
            github: {
                issues: {}
            }
        };
        context.github.paginate = jest.fn().mockResolvedValue(issues)
        context.github.issues.getForRepo = jest.fn()
        context.repo = jest.fn()
    })

    test("sorts issues from most reactions to least reactions", async () => {

        const topIssues = await getTopIssues(context, "+1", 5);

        expect(topIssues[0].reactions["+1"]).toBe(9)
        expect(topIssues[1].reactions["+1"]).toBe(6)
        expect(topIssues[2].reactions["+1"]).toBe(3)
    })

    test("trims issues to number of issues specified", async () => {

        const topIssues = await getTopIssues(context, "+1", 5);

        expect(topIssues.length).toBe(5)
    })
})

describe('addLabelToIssue', () => {
    let context, issue, labelToAdd;

    beforeEach( () => {
        issue = { 
              "number": 7,
              "title": "Found a bug",
              "labels": [
                {
                  "name": "bug"
                }
              ],
              "reactions": {
                "total_count": 9,
                "+1": 9
              }
            }
        context = {
            github: {
                issues: {}
            }
        };
        context.github.issues.addLabels = jest.fn()
        context.repo = jest.fn()
    })

    test("adds label to issue when label isn't already applied to issue", async () => {

        labelToAdd = "top issue"
        addLabelToIssue(context, issue, labelToAdd);

        expect(context.github.issues.addLabels).toBeCalledTimes(1)
    })

    test("does not add label to issue when label isn't already applied to issue", async () => {

        labelToAdd = "bug"
        addLabelToIssue(context, issue, labelToAdd);

        expect(context.github.issues.addLabels).not.toBeCalled
    })
})

describe('removeLabelFromIssue', () => {
    let context, issue, labelToRemove;

    beforeEach( () => {
        issue = { 
              "number": 7,
              "title": "Found a bug",
              "labels": [
                {
                    "name": "top issue"
                  }
              ],
              "reactions": {
                "total_count": 9,
                "+1": 9
              }
            }
        context = {
            github: {
                issues: {}
            }
        };
        context.github.issues.removeLabel = jest.fn()
        context.repo = jest.fn()
    })

    test("removes label to issue when label is applied to issue", async () => {

        labelToRemove = "top issue"
        removeLabelFromIssue(context, issue, labelToRemove);

        expect(context.github.issues.removeLabel).toBeCalledTimes(1)
    })

    test("does not remove label to issue when label isn't already applied to issue", async () => {

        labelToRemove = "bug"
        removeLabelFromIssue(context, issue, labelToRemove);

        expect(context.github.issues.removeLabel).not.toBeCalled
    })
})

describe('getIssuesWithLabel', () => {
    let context, label;

    beforeEach( () => {
        context = {
            github: {
                issues: {}
            }
        };
        context.github.paginate = jest.fn()
        context.github.issues.getForRepo = jest.fn()
        context.repo = jest.fn()
        label = "top issue"
    })

    test("gets issues with label", async () => {

        getIssuesWithLabel(context, label);

        expect(context.github.issues.getForRepo).toBeCalledTimes(1)
    })
})


