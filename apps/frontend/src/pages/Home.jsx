import React from 'react';
import Hero from '../components/Hero.jsx';
import CardList from '../components/CardList.jsx';
import Footer from '../components/Footer.jsx';

const Home=() =>{
    return(
        <div className='p-5'>
            <Hero />
            <CardList />
            <CardList />
            <CardList />
            
            <Footer />
        </div>
    );
}
export default Home;