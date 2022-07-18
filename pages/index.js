import Head from 'next/head'
import Image from 'next/image'

import { ethers } from 'ethers'
import { useEffect,useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import { MapInteractionCSS } from 'react-map-interaction';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Modal from "../components/Modal"
import ModalM from '../components/ModalM'
import MarketItemDetails from "../components/MarketItemDetails"
import Market from "../components/Market"
import CreateAssets from '../components/CreateAssets'

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [myNfts, setMyNfts] = useState([])
  const [boughtNfts, setBoughtNfts] = useState([])

  const [loadingState, setLoadingState] = useState('not-loaded')
  const [loadingStateMy, setLoadingStateMy] = useState('not-loaded')
  const [loadingStateBought, setLoadingStateBought] = useState('not-loaded')


  const [show, setShow] = useState(false);
  const [showm, setShowm] = useState(false);
  const [showd, setShowd] = useState(false);
  const [id,setId]=useState('');  
  const [text, setText] = useState('')
  const [showi, setShowi] = useState(false);
  const [showc, setShowc] = useState(false);
  const [texti, setTexti] = useState('');

  useEffect(() => {
    loadNFTs();
    loadMyNFTs();
    loadBoughtNFTs();
  }, [])

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    //"https://rpc-mumbai.maticvigil.com"
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider)
    const data = await marketContract.fetchMarketItems()
    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }

  async function loadMyNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    /* create a filtered array of items that have been sold */   
    setMyNfts(items)
    setLoadingStateMy('loaded') 
  }

  async function loadBoughtNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setBoughtNfts(items)
    setLoadingStateBought('loaded') 
  }

  console.log("nfts",nfts);
  console.log("mynfts",myNfts);
  console.log("boughtNfts",boughtNfts);

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }


  const x=-1010 ;
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=' overlay'>    

      <TransformWrapper
         minScale={.5}
         maxScale={1}
         initialScale={.5}       
         centerOnInit
         centerZoomedOut      
            
        // limitToBounds={false}
        // onWheel={()=>{console.log("whell")}}
        // onZoom={()=>{console.log("zoom")}}
        
    >
   <TransformComponent wrapperClass='castle-overlay' contentClass='castle-bg'>
  
   <div className='fire-wrap-1 fire-wrap'>
       <div className='fire'></div>
     </div>

     <div className='jester-container'>
       <div className='jester-wrap'> 
     <div className='jester-grandle-btn click-cursor'>
       <button className='game-button click-cursor' onClick={()=>{setShow(true); setText('Staking')}}>
         <div className='title'>Staking</div>
         <img src='../assets/bubble-arrow.c34d2c3a.png' alt='buble'/>
       </button>
     </div>
     </div>
     </div>

     <div className='land-auction-btn click-cursor'>
       <button className='game-button click-cursor' onClick={()=>{setShowm(true); setText('Marketplace')}}>
         <div className='title'>Marketplace</div>
         <img src='../assets/bubble-arrow.c34d2c3a.png' alt='buble'/>
       </button>
     </div>


   </TransformComponent>
    </TransformWrapper>
    <Modal show={show} setShow={setShow} text={text}/>
    <ModalM showm={showm} setShowm={setShowm} text={text} setShowi={setShowi} setTexti={setTexti} setShowc={setShowc}/>
    <Market showi={showi} setShowm={setShowm} setShowi={setShowi} texti={texti} setId={setId} setShowd={setShowd} nfts={nfts} buyNft={buyNft} myNfts={myNfts} boughtNfts={boughtNfts}/>
    
    <CreateAssets showc={showc} setShowc={setShowc} setShowm={setShowm}  texti={texti} />

    <MarketItemDetails showd={showd} setShowd={setShowd} id={id} setId={setId} setShowi={setShowi}/>
  </div>

    </div>
  )
}
