const donnation = artifacts.require('./donnation.sol')
const truffleAssert = require('truffle-assert')

contract('donnation', (accounts) => {
  const mockTitleEventOne = 'First donnation Event'
  const mockTitleEventTwo = 'Operation'
  const DONATION = 1000000
  let donnation 
  
  before(async () => {
    donnation  = await donnation .deployed()
  })

  describe('createvent', () => {
    it('nouveau evenement en blockchain', async () => {
      const mockDescription = 'argent pour une operation'
      const mockGoal = 1000
      
      await donnation .createEvent(mockTitleEventOne, mockDescription, mockGoal, { from: accounts[1] })
      
      const newdonevent = await donnation .donnations(0)

      assert.equal(parseInt(newdonevent.id.toString()), 0)
      assert.equal(parseInt(newdonevent.actuel.toString()), 0)
      assert.equal(parseInt(newdonevent.objectif.toString()), mockGoal)
      assert.equal(newdonevent.status, true)
      assert.equal(newdonevent.createur, accounts[1])
      assert.equal(newdonevent.titre, mockTitleEventOne)
      assert.equal(newdonevent.description, mockDescription)
    })

    it('incrementation de id apres cration evenement avec succes', async () => {
      const id = await donnation .eventId()
      assert.equal(parseInt(id.toString()), 1)
    })
  })

  describe('donate', () => {
    before(async () => {
      
      await donnation.donate(0, { from: accounts[2], value: DONATION })
    })

    it('dimunuer balance pour evenement', async () => {
      const newEvent = await donnation.donnations(0)
      assert.equal(parseInt(newEvent.current.toString()), DONATION)
    })
  })

  describe('retirer', () => {
    it('ne pas permettre au créateur de l événement de retirer l argent', async () => {
      try {
        await donnation.withdraw(0, { from: accounts[2] })
        assert.notOk(false)
      } catch (error) {
        assert.ok(error)
      }
    })

    it('doit permettre au créateur de l événement de retirer l argent', async () => {
      const firstUser = accounts[1]
      const originalBalance = await web3.eth.getBalance(firstUser)

      const tx = await donnation.withdraw(0, { from: firstUser })

      
      truffleAssert.eventEmitted(tx, 'Withdraw', async () => {
        const updatedBalance = await web3.eth.getBalance(firstUser)
        return (
          parseInt(originalBalance) + DONATION === updatedBalance
        )
      })
    })

    it('devrait fermer l événement une fois que l utilisateur a retiré l argent', async () => {
      const event = await donnation.donnations(0)
      assert.notOk(event.status)
    })
  })

  describe('getdatahome', () => {
    before(async () => {
      
      await donnation.createEvent(mockTitleEventTwo, 'pour une operation', 250000, { from: accounts[2] })
    })

    it('retourner id et evenement', async () => {
      const homeData = await donnation.getHomeData()
      const [firstEvent, secondEvent] = homeData
      assert.equal(firstEvent.titre, mockTitleEventOne)
      assert.equal(parseInt(firstEvent.id.toString()), 0)
      assert.equal(secondEvent.titre, mockTitleEventTwo)
      assert.equal(parseInt(secondEvent.id.toString()), 1)
    })
  })
})