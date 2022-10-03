import React, { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { Button } from 'bootstrap'

export default function HomePage() {
  const [defoAccount, setDefoAccount] = useState('')
  const [num, setNum] = useState(0)

  const connectWallet = async () => {
    if (window.ethereum) {
      const result = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setDefoAccount(result[0])
      retrieveNum()
    }
  }

  const retrieveNum = async () => {
    let abi = [
      'function store(uint256 num) public',
      'function retrieve() public view returns (uint256)',
    ]
    // let provider = ethers.getDefaultProvider()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let contractAddress = '0xd589E208B12597D0ebF2DBb934588dbfB4a68eec'
    let contract = new ethers.Contract(contractAddress, abi, provider)
    console.log('contract', contract)
    let currentValue = await contract.retrieve()
    console.log('currentValue', currentValue.toNumber())
    setNum(currentValue.toNumber())
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
      {defoAccount ? (
        <h4>current stored number: {num}</h4>
      ) : (
        <button onClick={connectWallet}>connect to metamask</button>
      )}
    </div>
  )
}
