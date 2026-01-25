import {Swiper,SwiperSlide} from 'swiper/react';
import 'swiper/css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../lib/apiClient";
import SaveButton from "./SaveButton";
import LikeButton from "./LikeButton";

const CardList = ({ title, category, onLoaded }) => {
    const [data,setData]=useState([])
    useEffect(()=>{
        let isActive = true;
        const loadCategory = async () => {
            try {
                const response = await apiClient.get(`/movies/category/${category}`, {
                    params: { page: 1 }
                });
                if (!isActive) {
                    return;
                }
                setData(response.data?.results || []);
            } catch (err) {
                if (!isActive) {
                    return;
                }
                console.error(err);
                setData([]);
            } finally {
                // Notify parent that this card list finished loading.
                if (onLoaded) {
                    onLoaded(category);
                }
            }
        };

        loadCategory();

        return () => {
            isActive = false;
        };
        },[category]);
    return (
        <div className="text-white md:px-4 ">
            <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>
            <Swiper
                slidesPerView={"auto"}
                className="MySwiper"
                spaceBetween={10}
                loop={data.length > 6}
                loopAdditionalSlides={6}
            >
            {data.map((item,index)=>(
                <SwiperSlide  key={index} className="max-w-72">
                    <Link to={`/movie/${item.id}`}>
                        <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-3 shadow-lg h-75 cursor-pointer">
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                                alt={item.title}
                                className="h-44 w-full object-center object-cover rounded-lg"
                            />
                            <h3 className="text-center pt-2">{item.title}</h3>
                            {/* Quick actions keep the card feeling complete. */}
                            <div className="flex gap-2 justify-center mt-3">
                                <SaveButton movie={item} compact />
                                <LikeButton movie={item} compact />
                            </div>
                        </div>
                    </Link>


                </SwiperSlide>
            ))}
            </Swiper>
        
        
        </div>

    );

}


export default CardList;
