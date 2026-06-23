import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import HowItWorks from '../components/HowItWorks';
import FeaturedVenues from '../components/FeaturedVenues';
import WhyChooseUs from '../components/WhyChooseUs';

export default function Home() {
    return (
        <main>
            <Hero />
            <Marquee />
            <HowItWorks />
            <FeaturedVenues />
            <WhyChooseUs />
        </main>
    );
}
