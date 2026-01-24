import React, { useEffect, useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


const Hero = () => {
    const [movies,setMovies]=useState(null);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTI1NWY2NjUwYzIyZDFhZGEwYTlmMDRiNmRiNjk3OCIsIm5iZiI6MTc2ODg1MzgwNS40ODMsInN1YiI6IjY5NmU5MTJkMzA1MmE1NTMyZjIwZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hw7lsouzv5l7hcMSRwC1GRKPfcaCjChsmOSEtq86bJ0'
        }
    };


    useEffect(() => {


        fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
        .then(res => res.json())
        .then(res => {
            if (res.results && res.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * res.results.length);
                setMovies(res.results[randomIndex]);
        }
    }
        )
        .catch(err => console.error(err));
    }, []);
    if (!movies) {
        return <div>Loading...</div>;
    }
    return (
        <div className="text-white relative">
            <h1 className="text-red-600 absolute top-4 left-4 text-3xl md:text-5xl font-bold z-10">{movies?.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original${movies?.backdrop_path}`} alt="" className="w-full rounded-2xl h-[700px] object-contain object-cover"/>
            <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4" >
                <button className="flex justify-center items-center bg-white hover:bg-gray-200 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base" ><Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5"/> Save for Later</button>
                <button className="flex justify-center items-center bg-white hover:bg-gray-200 text-[#e50914] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base"><Heart className="mr-2 w-4 h-5 md:w-5 md:h-5" />Like</button>
            </div>
        </div>
    );

}

export default Hero;
