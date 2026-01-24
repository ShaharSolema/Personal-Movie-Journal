import React from 'react';
import Hero from '../components/Hero.jsx';
import CardList from '../components/CardList.jsx';
import Footer from '../components/Footer.jsx';

const Home=() =>{
    return(
        <div className='p-5'>
            <Hero />
            <CardList title="Now Playing" category="now_playing"/>
            <CardList title="Popular" category="popular"/>
            <CardList title="Top Rated" category="top_rated"/>
            <CardList title="Upcoming" category="upcoming"/>
            
            <Footer />
        </div>
    );
}
export default Home;