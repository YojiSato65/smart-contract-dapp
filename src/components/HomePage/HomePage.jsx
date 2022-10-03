import React, { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { Button, Modal } from 'react-bootstrap'

export default function HomePage() {
  const [num, setNum] = useState(0)
  const [inputNum, setInputNum] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [status, setStatus] = useState('')
  const abi = [
    'function store(uint256 num) public',
    'function retrieve() public view returns (uint256)',
    'function multiply(uint256 multiplier) public',
  ]
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contractAddress = '0x1e07EA6BA6E89cDBB014a6b78f686e996c46869d'
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    retrieveNum()
  }, [num])

  const retrieveNum = async () => {
    const contract = new ethers.Contract(contractAddress, abi, provider)
    // WHY doesn't this work??
    // let provider = ethers.getDefaultProvider()
    let currentValue = await contract.retrieve()
    setNum(currentValue.toNumber())
  }

  const updateNum = async (e) => {
    e.preventDefault()
    setStatus((status) => 'waiting for confirmation...')
    if (window.ethereum) {
      const result = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      try {
        const signer = provider.getSigner(result[0])
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const tx =
          multiplier === 1
            ? await contract.store(inputNum)
            : await contract.multiply(multiplier)
        setStatus((status) => 'sent')
        await tx.wait()
        setStatus((status) => 'tx is mined!')
        setMultiplier((prev) => 1)
        retrieveNum()
        setTimeout(handleClose, 1000)
      } catch (error) {
        console.log(error)
        setStatus((status) => 'tx is rejected!')
        setMultiplier((prev) => 1)
        setTimeout(handleClose, 1000)
      }
    } else {
      alert('install metamask')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>smart contract</h1>
      <>
        <h4>current stored number: {num}</h4>
        <form onSubmit={updateNum}>
          <input
            type="number"
            placeholder="update the number"
            value={inputNum}
            onChange={(e) => {
              setInputNum(e.target.value)
            }}
          />
          <button onClick={handleShow}>Update</button>
        </form>
        <form onSubmit={updateNum}>
          <input
            type="number"
            placeholder="multiply the number"
            value={multiplier}
            onChange={(e) => {
              setMultiplier(e.target.value)
            }}
          />
          <button onClick={handleShow}>Multiply</button>
        </form>
        <Modal show={show} onHide={handleClose} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Transaction status: {status}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  )
}
