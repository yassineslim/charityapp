import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Col, Row, Button, Modal, Form } from 'react-bootstrap'
import getImageForFundRaise from '../utils/get-image-for-fund-raise'
import AppContext from '../../app-context'

import './donnation.css'

export default function donnation({
  titre,
  id,
  description,
  actuel,
  objectif,
  closeModal,
  onChange,
  onSubmit,
  modalVisible,
  openModal,
  userdonCreateur,
  retirer,
  active
}) {
  return (
    <Container fluid="lg">
      <h1 className="mb-3">{titre}</h1>
      {
        userdonCreateur && active ?
          <Row>
            <Col className="p-2">
              <Button variant="danger" onClick={retirer}>retirer</Button>
            </Col>
          </Row> :
          null
      }
      <Row>
        <Col lg={8}>
          <div className="fund-raise-image" style={{ backgroundImage: `url("${getImageForFundRaise(id)}")` }}></div>
        </Col>
        {
          active ?
          <Col>
            <div className="don-side-panel mt-2 mt-lg-0">
              <div className="don-objectif">{actuel} don pour {objectif}...</div>
              <div className="donate-button-container">
                <Button variant="primary" onClick={openModal}>Donate</Button>
              </div>
            </div>
          </Col> : 
          null
        }
      </Row>
      <p className="mt-3">{description}</p>
      <DonateModal
        onClose={closeModal}
        onChange={onChange}
        onSubmit={onSubmit}
        show={modalVisible}
      />
    </Container>
  )
}

function DonateModal({
  show,
  onClose,
  onSubmit,
  onChange
}) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>Donate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="montant">
            <Form.Label>montant (ETH)</Form.Label>
            <Form.Control type="text" name="montant" onChange={onChange}/>
          </Form.Group>
          <Button variant="secondary" onClick={onClose} className="me-1 mt-1">Fermer</Button>
          <Button variant="primary" type="submit" className="mt-1">Soumettre</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export function donnationWrapper() {
  const [donateForm, setDonateForm] = useState('')
  const [loading, setLoading] = useState(true)
  const [uiData, setUiData] = useState({})

  const { id } = useParams()

  const { dependencies } = useContext(AppContext)
  const { donnation, account, web3 } = dependencies

  useEffect(() => {
    (async function() {
      setUiData(await getFundRaiseData())
    })()
  }, [])
  
  useEffect(() => {
    if (uiData.actuel) {
      setupDonateListener()
      setupWithdrawListener()
      setLoading(false)
    }
  }, [uiData])

  async function getdonData() {
    return await donnation.methods.donnations(id).call()
  }

  function onChange(event) {
    setDonateForm(event.target.value)
  }

  async function onSubmit(event) {
    event.preventDefault()
    await donnation.methods.donate(id).send({ from: account, value: web3.utils.toWei(donateForm, 'ether') })
  }

  function setupDonateListener() {
    donnation.events.Donated({}, (error, contractEvent) => {
      const { amount } = contractEvent.returnValues
      const updatedTotal = parseInt(amount) + parseInt(uiData.actuel) + ''
      setUiData(previousState => ({ ...previousState, actuel: updatedTotal, modalVisible: false }))
    })
  }
  
  function setupWithdrawListener() {
    donnation.events.Withdraw({}, (error, contractEvent) => {
      setUiData(previousState => ({ ...previousState, status: false }))
    })
  }

  async function retirer() {
    await donnation.methods.retirer(id).send({ from: account })
  }

  return (
    !loading ?
      <donnation
        titre={uiData.titre}
        id={id}
        description={uiData.description}
        actuel={web3.utils.fromWei(uiData.actuel, 'ether')}
        objectif={web3.utils.fromWei(uiData.objectif, 'ether')}
        closeModal={() => setUiData(previousState => ({ ...previousState, modalVisible: false }))}
        onChange={onChange}
        onSubmit={onSubmit}
        modalVisible={uiData.modalVisible}
        openModal={() => setUiData(previousState => ({ ...previousState, modalVisible: true }))}
        userdonCreateur={<uiData className="createur"></uiData> === account}
        retirer={retirer}
        active={uiData.status}
      /> :
      <div>loading....</div>
  )
}