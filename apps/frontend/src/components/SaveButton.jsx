import {Bookmark} from "lucide-react";

const SaveButton=()=>{
    return (
         <button className="flex justify-center items-center bg-white hover:bg-gray-400 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base" ><Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5"/> Save for Later</button>
    );
}

export default SaveButton;