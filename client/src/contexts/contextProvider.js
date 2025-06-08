import { useContext } from "react";
import AuthContext from "./AuthContexts";

export const useAuth=()=>{
    return useContext(AuthContext)
}