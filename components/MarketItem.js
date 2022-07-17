
const MarketItem=({nft,buyNft,texti,setShowd,setId,setShowi})=>{

    return(
        <>
         <div className="col c-12 l-3 l-4">
                        <div>
                            <div className="land-item">
                                <div className="land-image-wrap">
                                    <div className="land-image" style={{backgroundImage: `url(${nft.image})`}}>
                                        <div className={"green-button land-sale-tag"}>{texti === "Buy Assets" && 'For Sale'}</div>
                                    </div>
                                </div>
                                <div className="land-item__details">
                                    <div className="land-item__header">
                                        <p>Name</p>
                                        <p>{nft.name}</p>
                                    </div>
                                    <div className="land-item__info">                                     
                                    
                                        <div className="land-info__row">
                                            {nft.price ? (
                                                <>
                                                 <p style={{fontWeight: 'bold'}}>For sale</p>
                                                 <p  style={{fontWeight: 'bold'}}>{nft.price}</p>
                                                 </>
                                            ) : (
                                                <p>Not for sale</p>
                                            )}
                                           
                                        </div>
                                    </div>
                                </div>
                                <div className="land-item__button-wrap">
                                    {/* <button className="green-button click-cursor" onClick={()=>{setId(id);setShowd(true);setShowi(false)}}>View Details</button> */}
                                    {texti === "Buy Assets" &&  <button className="green-button click-cursor" onClick={()=>buyNft(nft)}>Buy Asset</button>}                                   
                                    </div>
                            </div>
                        </div>
                    </div>  
               
        </>
    )
}
export default MarketItem;