const { getConfig, createLabelInRepo, getTopIssues, addLabelToIssue } = require('../functions')
jest.mock('./functions', () => ({
  getConfig: jest.fn(),
  createLabelInRepo: jest.fn(),
  getTopIssues: jest.fn(),
  addLabelToIssue: jest.fn()
}))

const { pruneOldLabels } = require('../top-label-prune')
jest.mock('./top-label-prune', () => ({
  pruneOldLabels: jest.fn()
}))

const { Application } = require('probot')

// Requiring our app implementation
const myProbotApp = require('../app')

const scheduleRepository = require('./test/fixtures/schedule.repository.json')

const createScheduler = require('probot-scheduler')

const interval = 10 * 1000 // 10 seconds

const mock_topIssues = [
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

describe('My Probot app', () => {
  let app, github

  const scheduleEvent = {
    event: 'schedule',
    payload: {
      action: 'repository',
      repository: {
        owner: {login: 'adamzolyak'},
        name: 'bottest'
      },
      installation: {id: 1}
    }
  }

  const labelsForRepo = [{
    "name": ":cow: Moooo!",
    "name": "green",
    "name": "red",
  }]

  beforeEach(() => {
    app = new Application()
    // Initialize the app based on the code from index.js
    app.load(myProbotApp)
    // This is an easy way to mock out the GitHub API
    github = {
      apps: {
        getInstallations: jest.fn()
      },
      paginate: {
        issues: {
          getLabels: jest.fn(() => labelsForRepo)
        }
      }
    }

    // Passes the mocked out GitHub API into out app instance
    app.auth = () => Promise.resolve(github)

    const scheduler = createScheduler(app, {interval: interval})
   
  })

  afterEach(() => {
    jest.resetAllMocks()
  });

  test('labels top issues on scheduler event with valid config', async () => {

    var mock_configFile = {
      labelName: ":cow: Moooo!",
      labelColor: "f442c2",
      numberOfIssuesToLabel: 5
    }

    getConfig.mockResolvedValue(mock_configFile)

    getTopIssues.mockResolvedValue(mock_topIssues)

    await app.receive(scheduleEvent)
    expect(getConfig).toHaveBeenCalledTimes(1)
    expect(createLabelInRepo).toHaveBeenCalledTimes(1)
    expect(createLabelInRepo.mock.calls[0][1]).toBe(":cow: Moooo!")
    expect(createLabelInRepo.mock.calls[0][2]).toBe("f442c2")
    expect(getTopIssues).toHaveBeenCalledTimes(1)
    expect(getTopIssues.mock.calls[0][1]).toBe("+1")
    expect(getTopIssues.mock.calls[0][2]).toBe(5)
    expect(addLabelToIssue).toHaveBeenCalledTimes(3)
    expect(addLabelToIssue.mock.calls[0][2]).toBe(":cow: Moooo!")
    expect(pruneOldLabels).toHaveBeenCalledTimes(1)
    expect(pruneOldLabels.mock.calls[0][1].length).toBe(3)   
    
  })

  test('stops on scheduler event with invalid config contents', async () => {

    var mock_configFile = {
      label: ":cow: Moooo!",
      color: "f442c2",
      numberOfIssuesToLabel: 5
    }

    getConfig.mockResolvedValue(mock_configFile)

    getTopIssues.mockResolvedValue(mock_topIssues)

    await app.receive(scheduleEvent)
    expect(getConfig).toHaveBeenCalledTimes(1)
    expect(createLabelInRepo).not.toHaveBeenCalled
    expect(getTopIssues).not.toHaveBeenCalled
    expect(addLabelToIssue).not.toHaveBeenCalled
    expect(pruneOldLabels).not.toHaveBeenCalled
    
  })


  test('stops on scheduler event with missing config', async () => {

    var mock_configFile = null

    getConfig.mockResolvedValue(mock_configFile)

    await app.receive(scheduleEvent)

    expect(getConfig).toHaveBeenCalledTimes(1)
    expect(createLabelInRepo).not.toHaveBeenCalled
    expect(getTopIssues).not.toHaveBeenCalled
    expect(addLabelToIssue).not.toHaveBeenCalled
    expect(pruneOldLabels).not.toHaveBeenCalled
      
  })
})