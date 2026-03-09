import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeaturedVenues from '../components/FeaturedVenues';
import WhyChooseUs from '../components/WhyChooseUs';

export default function Home() {
    return (
        <main>
            <Hero />
            <HowItWorks />
            <FeaturedVenues />
            <WhyChooseUs />
        </main>
    );
}
