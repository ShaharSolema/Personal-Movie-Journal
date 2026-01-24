import { Heart } from "lucide-react";

const LikeButton =()=>{
    return (
        <button className="flex justify-center items-center bg-white hover:bg-gray-400 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base"><Heart className="mr-2 w-4 h-5 md:w-5 md:h-5" />Like</button>
    );
}


export default LikeButton