import React from 'react'
import FeaturedProducts from './../FeaturedProducts/FeaturedProducts';
import CategorySlider from '../CategorySlider/CategorySlider';
import MainSlider from '../MainSlider/MainSlider';

export default function Home({userData}) {
  return <>
  <MainSlider/>
  <CategorySlider/>
  <FeaturedProducts userData={userData}/>

  </>
}
