import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'


const CreateAssets= ({showc,setShowc,setShowm,texti})=>{ 
    const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    console.log(event)
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
    
    setShowc(false);
    setShowm(true);
  }

    return(
        <div className={showc ? `land-auction overlay row active ` : `land-auction overlay row`} style={{display:'flex'}}>
        

            <div className="land-view-container col c-12 m-6 l-8 game-border fancy">
                <div className="close-btn click-cursor" onClick={()=>{setShowc(false);setShowm(true)}}></div>
                <h2 className="land-view__heading">{texti}</h2>
                <div className="create_assets">

                <input 
                placeholder="Asset Name"
                className="form_inp"
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea
                placeholder="Asset Description"
                className="form_inp"
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input
                placeholder="Asset Price in Eth"
                className="form_inp"
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <input
                type="file"
                name="Asset"
                accept="image/*"
                className="form_inp"
                onChange={onChange}
                />
                {
                fileUrl && (
                    <img className="img" width="70" src={fileUrl} />
                )
                }
                <button onClick={createMarket} className="green-button click-cursor">
                Create Digital Asset
                </button>
                   
             </div>      
            </div>
        </div>
    )
};

export default CreateAssets;