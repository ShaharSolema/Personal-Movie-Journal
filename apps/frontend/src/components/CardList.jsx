import Hero from "./Hero";
import {Swiper,SwiperSlide} from 'swiper/react';
import 'swiper/css';
import Url from "../../png/MyLOGO.png";


const CardList = () => {
    const data = [
        {
            id: 1,
            title: "Inception",
            description: "A mind-bending thriller by Christopher Nolan.",
            imageUrl: Url,
            rating: 0
        },
        {
            id: 2,
            title: "Interstellar",
            description: "A space exploration epic directed by Christopher Nolan.",
            imageUrl: Url,
            rating: 0
        },
        {
            id: 3,
            title: "The Dark Knight",
            description: "Batman faces the Joker in Gotham City.",
            imageUrl: Url,
            rating: 0
        },
        {
            id: 4,
            title: "Tenet",
            description: "A time-inversion thriller with global stakes.",
            imageUrl: Url,
            rating: 0
        },
        {
            id: 5,
            title: "Dune",
            description: "A sci-fi epic set on the desert planet Arrakis.",
            imageUrl: Url,
            rating: 0
        },
        {
            id: 6,
            title: "Blade Runner 2049",
            description: "A new blade runner uncovers a long-buried secret.",
            imageUrl: Url,
            rating: 0
        },
        {
            id: 7,
            title: "Arrival",
            description: "A linguist communicates with mysterious aliens.",
            imageUrl: Url,
            rating: 0
        },
        {
            id: 8,
            title: "The Matrix",
            description: "A hacker discovers the true nature of reality.",
            imageUrl: Url,
            rating: 0
        }
    ];

    return (
        <div className="text-white md:px-4 ">
            <h2 className="pt-10 pb-5 text-lg font-medium">Upcoming</h2>
            <Swiper slidesPerView={"auto"}className="MySwiper" spaceBetween={10}>
            {data.map((item,index)=>(
                <SwiperSlide  key={index} className="max-w-72">
                    <div className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl p-3 shadow-lg">
                        <img src={item.imageUrl} alt={item.title} className="h-44 w-full object-center object-cover" />
                        <h3 className="text-center pt-2">{item.title}</h3>
                        <p>{item.description}</p>
                    </div>

                </SwiperSlide>
            ))}
            </Swiper>
        
        
        </div>

    );

}


export default CardList;
