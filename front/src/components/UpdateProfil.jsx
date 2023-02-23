import axios from "axios"
import {useState, useEffect} from "react"
import { useParams } from "react-router-dom";
import {BASE_URL} from "../tools/constante.js"
import { NavLink, Navigate } from "react-router-dom"
import {lengthLimit, checkVide} from "../tools/inputCheck.js"
import ConfirmationWindow from "./ConfirmationWindow.jsx"

const UpdateProfil = (props) => {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [messageErr, setMessageErr] = useState("")
    const [isSure, setIsSure] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    let nowDate = new Date().toISOString().split('T')[0]
    
    useEffect(() => {
        setIsLoading(true)
        axios.post(`${BASE_URL}/getUserById`, { id: userId })
            .catch(err => console.log(err))
            .then(res => {
                const {first_name, last_name, birthday} = res.data.data[0]
                setUserInfo({first_name: first_name, last_name:last_name, birthday: reformeDate(birthday)})
                })
            .then(res => setIsLoading(false))
    }, [userId])
    
    const reformeDate = (data) =>{
        const date = new Date(data);
        const formattedDate = date.toLocaleDateString("fr-CA", { year: 'numeric', month: '2-digit', day: '2-digit' });
        return formattedDate
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if(!checkVide(userInfo)){
            setMessageErr("Champ obligatoire vide") 
            return
        }else if(nowDate < userInfo.birthday){
            setMessageErr("Date dépassé le limite") 
            return
        }
        
        axios.post(`${BASE_URL}/updateProfil`, {
            last_name: userInfo.last_name.trim(),
            first_name: userInfo.first_name.trim(),
            birthday: userInfo.birthday,
            id: userId
        }).then(res=>{
            if(res.statusText === "OK"){
                setMessageErr("L'informations sont bien enregistrer")
            }
        }).catch(err=>{
            console.log(err)
            return
        })
    }
    const handleChange = (e) => {
        setMessageErr("")
        if(!lengthLimit(e.target.value)){
            setMessageErr("tous les infos sont limit à 250 caractaires") 
            return
        }
        let newInfo = { ...userInfo, [e.target.name]: e.target.value }
        setUserInfo(newInfo)
    }
    
    const handleDelete = () =>{
        axios.post(`${BASE_URL}/admin/deleteUser`,{id:userId})
        .then(res=>{
                if(res.data.data.affectedRows > 0){
                    setIsDelete(true)
                }
            })
    }
    
    const handleCheck = () =>{
        setIsSure(!isSure)
    }
    
    if(isLoading){
        return <div>Loading....</div>
    }
    
    return (
        <div>
        {isDelete && 
                    <Navigate to={"/admin/users"} replace={true} /> 
            }
            <h2>Modifier Info</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nom">Nom: </label>
                <input type="text" name="last_name" value={userInfo.last_name} placeholder="nom" onChange={(e)=>handleChange(e)} />
                <label htmlFor="prenom">Prénom: </label>
                <input type="text" name="first_name" value={userInfo.first_name} placeholder="prenom" onChange={(e)=>handleChange(e)} />
                <label htmlFor="birthday">Votre date de naissance: </label>
                <input type="date" name="birthday" value={userInfo.birthday} onChange={(e)=>handleChange(e)} max={nowDate} />
                <button type="submit">Valider</button>
                {messageErr.length > 0 && <p>{messageErr}</p>}
            </form>
            <button onClick={handleCheck}>Supprimer le compte</button>
            {isSure && 
                <ConfirmationWindow isOpen={handleCheck} deleteFunction={handleDelete} name="ce compte?" />
            }
        </div>  
        )
}

export default UpdateProfil