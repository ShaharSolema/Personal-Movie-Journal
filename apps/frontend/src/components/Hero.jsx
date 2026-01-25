import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import apiClient from "../lib/apiClient";
import "swiper/css";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";

const Hero = ({ onLoaded }) => {
    const [movies, setMovies] = useState([]);


    useEffect(() => {


        let isActive = true;
        const loadUpcoming = async () => {
            try {
                const response = await apiClient.get("/movies/category/upcoming", {
                    params: { page: 1 }
                });
                if (!isActive) {
                    return;
                }
                const results = response.data?.results || [];
                if (results.length > 0) {
                    setMovies(results.filter((movie) => movie.backdrop_path));
                }
            } catch (err) {
                if (!isActive) {
                    return;
                }
                console.error(err);
            } finally {
                // Notify parent that Hero finished loading (success or error).
                if (onLoaded) {
                    onLoaded();
                }
            }
        };

        loadUpcoming();

        return () => {
            isActive = false;
        };
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
                                        <SaveButton movie={movie} />
                                        <LikeButton movie={movie} />
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
