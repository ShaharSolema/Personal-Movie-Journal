import Hero from "./Hero";
import {Swiper,SwiperSlide} from 'swiper/react';
import 'swiper/css';
import Url from "../../png/MyLOGO.png";
import { useEffect, useState } from "react";
import {Link} from "react-router";


const CardList = ({title,category}) => {
    const [data,setData]=useState([])
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTI1NWY2NjUwYzIyZDFhZGEwYTlmMDRiNmRiNjk3OCIsIm5iZiI6MTc2ODg1MzgwNS40ODMsInN1YiI6IjY5NmU5MTJkMzA1MmE1NTMyZjIwZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hw7lsouzv5l7hcMSRwC1GRKPfcaCjChsmOSEtq86bJ0'
        }
    };
    useEffect(()=>{
        fetch(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`, options)
            .then(res => res.json())
            .then(res => setData(res.results))
            .catch(err => console.error(err));
        },[]);
    return (
        <div className="text-white md:px-4 ">
            <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>
            <Swiper slidesPerView={"auto"}className="MySwiper" spaceBetween={10}>
            {data.map((item,index)=>(
                <SwiperSlide  key={index} className="max-w-72">
                    <Link to={`/movie/${item.id}`}>                    
                    <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-3 shadow-lg h-75">
                        <img src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`} alt={item.title} className="h-44 w-full object-center object-cover" />
                        <h3 className="text-center pt-2">{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                    </Link>


                </SwiperSlide>
            ))}
            </Swiper>
        
        
        </div>

    );

}


export default CardList;
