
import Image from "next/image";

// Import images properly
import investImg from "../../assets/images/Secured-Investment.jpg";
import reliableImg from "../../assets/images/reliable.webp";
// import homeLoanImg from "../../assets/images/Home-Loan.webp";
import homeLoanImg2 from "../../assets/images/banner_property.png";
import taxImg from "../../assets/images/Tax-Benifit.jpg";
import liquidityImg from "../../assets/images/liquidity.webp";
import instantImg from "../../assets/images/Instant-Loan-Processing.jpg";

export default function HomeLoanContainer() {
    const benefits = [
        {
            image: investImg,
            title: "Secured Investment",
            description: "Invest risk-free in genuine properties verified by banks",
        },
        {
            image: reliableImg,
            title: "Reliable Expertise",
            description: "Our experts will support you in documentation with financing partners",
        },
        {
            image: taxImg,
            title: "Tax Benefits",
            description: "Availing home loans can provide amazing tax return benefits",
        },
        {
            image: liquidityImg,
            title: "Liquidity",
            description: "Enjoy easy access to funding for multiple property-related tasks",
        },
        {
            image: instantImg,
            title: "Instant Processing",
            description: "We make processing efficient and as quick as possible",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 ">

            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={homeLoanImg2}
                        alt="Home Loan Hero"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </section>

            <p className="text-red-400 text-center text-2xl mt-10">Currently car loan is not available</p>


            <section className="max-w-6xl w-full mx-auto py-10 ">
                <div className=" mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            How Home Loans Can Help
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover the powerful advantages of home loans and transform your property investment journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xs overflow-hidden transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative h-32 w-full overflow-hidden">
                                    <Image
                                        src={benefit.image}
                                        alt={benefit.title}
                                        width={400
                                        }
                                        height={300}

                                        className="object-cover object-center transition-transform duration-300 hover:scale-110"
                                    />
                                </div>

                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
