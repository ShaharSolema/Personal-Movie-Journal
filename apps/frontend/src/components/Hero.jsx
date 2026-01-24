import React, { useEffect, useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import {Link} from "react-router";
import "swiper/css";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";


const Hero = () => {
    const [movies, setMovies] = useState([]);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTI1NWY2NjUwYzIyZDFhZGEwYTlmMDRiNmRiNjk3OCIsIm5iZiI6MTc2ODg1MzgwNS40ODMsInN1YiI6IjY5NmU5MTJkMzA1MmE1NTMyZjIwZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hw7lsouzv5l7hcMSRwC1GRKPfcaCjChsmOSEtq86bJ0'
        }
    };


    useEffect(() => {


        fetch("https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1", options)
            .then((res) => res.json())
            .then((res) => {
                if (res.results && res.results.length > 0) {
                    setMovies(res.results.filter((movie) => movie.backdrop_path));
                }
            })
            .catch((err) => console.error(err));
    }, []);
    if (!movies.length) {
        return <div>Loading...</div>;
    }
    return (
        <div className="text-white relative">
            <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                loop
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                className="rounded-2xl"
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <Link to={`/movie/${movie.id}`}>
                            <div className="relative">
                                <h1 className="text-red-600 absolute top-4 left-4 text-3xl md:text-5xl font-bold z-10">
                                    {movie.title}
                                </h1>
                                <img
                                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                    alt={movie.title}
                                    className="w-full rounded-2xl h-[700px] object-cover"
                                />
                                <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4" >
                                        <SaveButton/>
                                        <LikeButton/>
                                    </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );

}

export default Hero;
