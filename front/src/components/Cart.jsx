import {useEffect,useContext,useState} from 'react'
import axios from 'axios'
import { StoreContext } from "../tools/context.js"
import {BASE_URL, BASE_IMG} from "../tools/constante.js"
import { NavLink, Navigate } from "react-router-dom"
import CartCard from "./CartCard.jsx"

const Cart = () => {
    const [state, dispatch] = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect( () => {
            if (state.cartItems.length > 0){
                setIsLoading(false)
            }
            else if(state.products.length > 0 || state.cartItems === []) {
               getCartItemsArray();
               setIsLoading(false)
            }
            else {
               setIsLoading(true);
                axios
                  .get(`${BASE_URL}/products`)
                  .then(function (response) {
                    dispatch({ type: "PRODUCTLIST", payload: response.data.data.result});
                    getCartItemsArray();
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
                  .finally(()=>setIsLoading(false))
              }
    }, []);
    
    
    const getCartItemsArray =  () => {
        const data =  state.cart.map(item => {
        const product = state.products.find(p => p.id === item.product_id);
        return {
            id: product.id,
            url: product.url,
            stock: Number(product.stock),
            name: product.name,
            price: product.price,
            quantity: Number(item.quantity),
            caption: product.caption
        };
        });
        console.log(data)
        dispatch({ type: "GET_CART_ITEMS", payload: data});
        setIsLoading(false)
    }
    
    const incre = (index) =>{
        //check quantity in his chart
        // if(e.targer.value >= cartItems[index].stock || quantity + data.quantity >= data.stock){
        //     return
        // }
        let newList = state.cartItems
        newList[index].quantity = newList[index].quantity + 1
        console.log(newList)
        dispatch({ type: "GET_CART_ITEMS", payload: newList});
    }
    const decre = (index) =>{
        // if(quantity > 0){
        //     setQuantity(quantity-1)
        // }
        let newList = state.cartItems
        newList[index].quantity = newList[index].quantity - 1
        console.log(newList)
        dispatch({ type: "GET_CART_ITEMS", payload: newList});
    }
    
    if(isLoading){
        // return <div>{!state.isLogged && <Navigate to="/login" replace={true} />}Loading...</div>
        return <div>Loading</div>
    }
    
    if(state.cart===[]){
        return (
            <div className="flex flex-cols justify-center items-center">
                <h1>Vous n'avez pas encore de produits dans votre panier.</h1>
                <NavLink className="text-center" to={`/shop`}>
                    <p>E-Commerce</p>
                </NavLink>
            </div>    
        )
    }
    
    return (
        <div className="mx-4 min-h-full w-full">
            <div className="border-b-2 border-gray-100 mb-4 py-8">
                <h2>Votre Panier: </h2>
            </div>
            <table className="table-fixed w-full max-h-96">
              <thead className="sticky top-0">
                <tr className="bg-gray-100 rounded overflow-hidden">
                  <th className="py-4 text-lg">Photo</th>
                  <th className="py-4 text-lg">Nom du produits</th>
                  <th className="py-4 text-lg">Quantité</th>
                  <th className="py-4 text-lg">Prix</th>
                  <th className="py-4 text-lg">Supprimer</th>
                </tr>
              </thead>
              <tbody className="overscroll-auto overflow-y-scroll">
              {state.cartItems.map((product, i) => {
                    return (
                        <tr key={i} className="my-2">
                            <td>
                                <NavLink className="text-center w-auto" to={`/product/${product.id}`}>
                                    <img className="object-contain w-auto h-full" 
                                        src={`${BASE_IMG}/${product.url}`} alt={product.caption} />
                                </NavLink>
                            </td>
                            <td>
                                <NavLink className="text-center w-auto" to={`/product/${product.id}`}>
                                    <p>{product.name}</p>
                                </NavLink>
                            </td>
                            <td  className="text-center">
                                <div className="text-center">
                                    <p className="inline-block py-2 px-4 rounded bg-gray-900 hover:bg-primary text-gray-100" onClick={()=>decre(i)}>-</p>
                                    <p className="inline-block m-2">{product.quantity}</p>
                                    <p className="inline-block py-2 px-4 rounded bg-gray-900 hover:bg-primary text-gray-100" onClick={()=>incre(i)}>+</p>
                                </div>
                            </td>
                            <td  className="text-center">
                                <p>{product.quantity*product.price} €</p>
                            </td>
                            <td className="text-center">
                                <button className="py-2 px-4 rounded bg-gray-900 hover:bg-primary">X</button>
                            </td>
                        </tr>
                    )
                })}
              </tbody>
            </table>
        </div>
    )   
}    

export default Cart