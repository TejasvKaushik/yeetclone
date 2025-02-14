import { authModalState } from '@/atoms/authModalAtom';
import AuthModal from '@/components/Modals/AuthModal';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const gifs = ['/Ao.gif', '/Co.gif'];


type AuthPageProps = {
    
};

const AuthPage:React.FC<AuthPageProps> = () => {
    const authModal = useRecoilValue(authModalState);
    const [user, loading, error] = useAuthState(auth);
    const [pageLoading, setPageLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if(user) router.push('/');
        if(!loading && !user) setPageLoading(false);
    }, [user, router, loading]);

    if(pageLoading) return null;
    return <div className="bg-dark-layer-2  h-screen relative">
        <div className='max-w-7xl mx-auto'>
            <Navbar />
            <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        modules={[Autoplay]}
                        className="w-[500px] h-[500px]"
                    >
                        {gifs.map((gif, index) => (
                            <SwiperSlide key={index}>
                                <Image src={gif} alt={`Slide ${index}`} width={500} height={500} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
            {authModal.isOpen && <AuthModal />}
        </div>
    </div>
}
export default AuthPage;