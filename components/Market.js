import MarketItem from "./MarketItem"
import { useState,useEffect} from "react"



const Market= ({showi,setShowi,setShowm,texti,setId,setShowd,nfts,buyNft,myNfts,boughtNfts})=>{
    const [items,setItems]=useState([]);
    const [myItems,setMyItems]=useState([]);
    const [boughtItems,setBoughtItems]=useState([]);
    const [selected,setSelected]=useState('4')
    const [selectedt,setSelectedt]=useState('');
    const [text,setText]=useState('')

    
 

    function sortBy(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
        }
        return function(a, b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
        }
      }  

        if(selected === '0' && selectedt === '0'){
        items.sort(sortBy('-id'));
        }
        if(selected === '1' && selectedt === '0'){
        items.sort(sortBy('name'));
        }
        if(selected === '2' && selectedt === '0'){
            items.sort(sortBy('-price'));
        }  

        if(selected === '0' && selectedt === '1'){
        items.sort(sortBy('id'));
        }
        if(selected === '1' && selectedt === '1'){
        items.sort(sortBy('-name'));
        }
        if(selected === '4' && selectedt === '2'){
            items.sort(sortBy('price'));
        }  




    useEffect(()=>{
        setItems(nfts);
        setMyItems(myNfts);
        setBoughtItems(boughtNfts);
    },[nfts]);
   

    return(
        <div className={showi ? `land-auction overlay row active ` : `land-auction overlay row`} style={{display:'flex'}}>
        

            <div className="land-view-container col c-12 m-6 l-8 game-border fancy">
                <div className="close-btn click-cursor" onClick={()=>{setShowi(false);setShowm(true)}}></div>
                <h2 className="land-view__heading">{texti}</h2>
                <div className="summry-sort-land">
                    <div className="land-summary">
                    {texti === "Buy Assets" &&   <span>Showing {items.length} Assets</span>}                      
                    {texti ==="View My Assets" &&   <span>Showing {myItems.length + Number(boughtItems.length)} Assets</span>}                      
                    </div>
                    <div className="land-sort">
                     <span className="land-sort__label">Sort By:</span>
                     <div className="land-select__list" id="landPropertyLabel">
                         <select className="click-cursor" name="sortType" id="sortType" onChange={(e)=>setSelected(e.target.value)} value={selected} defaultValue={'2'}>
                         <option value={'0'}>ID</option>    
                         <option value={'1'}>Name</option>
                         <option value={'2'}>Sale Price</option>    
                         </select>
                     </div>
                     <div className="land-select__list" id="landPropertyLabel">
                         <select className="click-cursor" name="sortType" id="sortType" onChange={(e)=>setSelectedt(e.target.value)} value={selectedt} defaultValue={'0'}>
                         <option value='0'>Ascending</option>
                         <option value='1'>Descending</option>
                         </select>
                     </div>
                    </div>
                </div>

                <div className="land-list game-scroll-bar row">
                    {     items.length > 0 ?
                          texti === "Buy Assets" && items.map(item=> <MarketItem key={item.id} nft={item}  buyNft={buyNft} texti={texti} /> )
                          : 'no lands available'
                    }
                    {     myItems.length > 0 ?
                             texti === "View My Assets" && myItems.map(item=> <MarketItem key={item.id} nft={item}  setId={setId} setShowd={setShowd} setShowi={setShowi}/>)
                             : 'no lands created'
                    }
                    {     boughtItems.length > 0 ? 
                             texti === "View My Assets" && boughtItems.map(item=> <MarketItem key={item.id} nft={item}  setId={setId} setShowd={setShowd} setShowi={setShowi}/>)
                             : 'no lands bought yet'
                    }
                
                </div>
            </div>
        </div>
    )
};

export default Market;