const { pruneOldLabels  } = require('./top-label-prune')
const { getIssuesWithLabel, removeLabelFromIssue } = require('./functions')

jest.mock('./functions', () => ({
    getIssuesWithLabel: jest.fn(),
    removeLabelFromIssue: jest.fn()
}))

describe('pruneOldLabels', () => {
    let context, issuesToLabel, label;

    beforeEach( () => {
        mock_issuesWithLabel = [
            { 
                "number": 7,
                "title": "Found a bug",
                "reactions": {
                "total_count": 9,
                "+1": 9
                }
            },
            { 
                "number": 10,
                "title": "Found a bug",
                "reactions": {
                "total_count": 6,
                "+1": 6
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
                "number": 1,
                "title": "Found a bug",
                "reactions": {
                "total_count": 0,
                "+1": 0
                }
            }, 
            {
                "number": 16,
                "title": "Found a bug",
                "reactions": {
                "total_count": 1,
                "+1": 0
                }
            }
        ]
        mock_issuesToLabel = [
            { 
                "number": 7,
                "title": "Found a bug",
                "reactions": {
                "total_count": 9,
                "+1": 9
                }
            },
            { 
                "number": 10,
                "title": "Found a bug",
                "reactions": {
                "total_count": 6,
                "+1": 6
                }
            },
            { 
                "number": 2,
                "title": "Found a bug",
                "reactions": {
                "total_count": 3,
                "+1": 3
                }
            } 
        ]
        context = {
            github: {
                issues: {}
            }
        };
        context.repo = jest.fn()
    })

    test("removes label from issues that are no longer in top issues", async () => {

        getIssuesWithLabel.mockResolvedValue(mock_issuesWithLabel)

        label = "top issue"
        await pruneOldLabels(context, mock_issuesToLabel, label)

        expect(getIssuesWithLabel).toBeCalledTimes(1)
        expect(removeLabelFromIssue).toBeCalledTimes(2)
        expect(removeLabelFromIssue.mock.calls[0][1]).toBe(mock_issuesWithLabel[3])
        expect(removeLabelFromIssue.mock.calls[1][1]).toBe(mock_issuesWithLabel[4])
        expect(removeLabelFromIssue.mock.calls[0][2]).toBe(label)
    })
})