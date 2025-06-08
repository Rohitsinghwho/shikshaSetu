import { useContext } from "react";
import BookingContext from "./BookingContext";

export const useBook=()=>{
    return useContext(BookingContext)
}